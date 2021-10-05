import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { ConfigService } from '@nestjs/config';
import * as cf from 'aws-cloudfront-sign';
import { Member } from 'src/members/entities/members.entity';
import {
    GetS3DownloadSignedUrlInput,
    GetS3DownloadSignedUrlOutput,
} from './dtos/get-s3-download-signed-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Analysis } from 'src/analyses/entities/analyses.entity';
import { Repository } from 'typeorm';
import { GetS3UploadSignedUrlOutput } from './dtos/get-s3-upload-signed-url.dto';

@Injectable()
export class AwsService {
    constructor(
        @InjectAwsService(S3) private readonly s3: S3,
        private readonly config: ConfigService,
        @InjectRepository(Analysis)
        private readonly analysisRepo: Repository<Analysis>,
    ) {}
    async callAutoMotionWorkerApi(
        anSeq: string,
        userVideoUrl: string,
        refVideoUrl: string,
    ) {
        /**
         * TODO
         * 인공지능 돌리는 EC2에 분석 요청
         */
        return true;
    }

    async getS3UploadSignedUrl(): Promise<GetS3UploadSignedUrlOutput> {
        try {
            const bucket = this.config.get('AWS_UPLOAD_S3_BUCKET');
            const s3ObjectName = await this.generateS3ObjectName();
            const videoFormat = 'webm';

            const params = {
                Bucket: bucket,
                Key: `${s3ObjectName}.${videoFormat}`,
                Expires: 3600,
                ContentType: videoFormat,
                ACL: 'public-read',
            };

            const signedUrl = await this.s3.getSignedUrlPromise(
                'putObject',
                params,
            );
            return { ok: true, signedUrl, s3ObjectName };
        } catch (error) {
            console.log(error.stack, error.message);
            return { ok: false, error: '업로드 URL을 받아오지 못했습니다.' };
        }
    }

    async getS3DownloadSignedUrl(
        authMember: Member,
        params: GetS3DownloadSignedUrlInput,
    ): Promise<GetS3DownloadSignedUrlOutput> {
        try {
            const { anSeq } = params;
            const { mbrSeq } = authMember;

            const analysis = await this.analysisRepo.findOne({ anSeq });

            const isMemberOwner = analysis.mbrSeq == mbrSeq;
            if (!analysis || !isMemberOwner) {
                return { ok: false, error: '해당하는 비디오가 없습니다.' };
            }

            const s3ObjectName = analysis.anUserVideoURL;
            const cfUrl = this.config.get('AWS_CLOUDFRONT_ENDPOINT');
            const keypairId = 'K2EDJ5BBPQ7ZL3';
            const s3UploadSignedUrl = cf.getSignedUrl(
                `${cfUrl}/${s3ObjectName}`,
                {
                    privateKeyPath: this.config.get('AWS_PRIVATE_KEY_LOCATION'),
                    expireTime: new Date(2021, 10, 10, 0, 0, 0),
                    keypairId,
                },
            );
            return { ok: true, signedUrl: s3UploadSignedUrl };
        } catch (error) {
            console.log(error.message);
            return { ok: false, error: '다운로드 URL을 받아오지 못했습니다.' };
        }
    }

    private async generateS3ObjectName(): Promise<string> {
        let possibleName;
        let isS3ObjectExists;

        do {
            possibleName = this.randomName();
            isS3ObjectExists = await this.isS3ObjectExists(possibleName);
        } while (isS3ObjectExists);

        return possibleName;
    }

    private async isS3ObjectExists(name: string): Promise<boolean> {
        try {
            const data = await this.s3
                .headObject({
                    Bucket: 'wavy-test',
                    Key: name,
                })
                .promise();
            return data ? false : true;
        } catch (error) {
            return false;
        }
    }

    private randomName(): string {
        return `user-video-${new Date().toISOString()}-${Math.floor(
            Math.random() * 1000,
        )}`.replace(/:/g, '-');
    }
}
