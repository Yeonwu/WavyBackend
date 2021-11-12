import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { Analysis } from 'src/analyses/entities/analyses.entity';
import { Member } from 'src/members/entities/members.entity';
import { Repository } from 'typeorm';
import {
    GetS3DownloadSignedUrlInput,
    GetS3DownloadSignedUrlOutput,
} from './dtos/get-s3-download-signed-url.dto';
import { GetS3UploadSignedUrlOutput } from './dtos/get-s3-upload-signed-url.dto';
import * as cf from 'aws-cloudfront-sign';

@Injectable()
export class UserVideoS3Service {
    constructor(
        @InjectAwsService(S3)
        protected readonly s3: S3,
        @InjectRepository(Analysis)
        protected readonly analysisRepo: Repository<Analysis>,
        protected readonly config: ConfigService,
    ) {}

    async getS3SignedUrl(
        bucket: string,
        s3ObjectName: string,
        contentType: string,
        action: string,
    ): Promise<string> {
        const params = {
            Bucket: bucket,
            Key: `${s3ObjectName}`,
            Expires: 3600,
            ContentType: contentType,
            ACL: 'public-read',
        };

        const signedUrl = await this.s3.getSignedUrlPromise(action, params);
        return signedUrl;
    }

    async getS3UploadSignedUrl(): Promise<GetS3UploadSignedUrlOutput> {
        try {
            const bucket = this.config.get('AWS_USER_VIDEO_UPLOAD_S3_BUCKET');
            const s3ObjectName = await this.getS3ObjectName(bucket);
            const contentType = 'video/webm';

            const signedUrl = await this.getS3SignedUrl(
                bucket,
                s3ObjectName,
                contentType,
                'putObject',
            );

            return { ok: true, s3ObjectName, signedUrl };
        } catch (error) {
            console.log(error.stack, error.message);
            return { ok: false, error: 'url을 받아오지 못했습니다.' };
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

            const s3ObjectName = analysis.anUserVideoFilename;
            const cfUrl = this.config.get('AWS_USER_VIDEO_CF_ENDPOINT');
            const keypairId = 'K2EDJ5BBPQ7ZL3';
            const expireTime = new Date();
            expireTime.setDate(expireTime.getDate() + 7);

            const s3UploadSignedUrl = cf.getSignedUrl(
                `${cfUrl}/${s3ObjectName}`,
                {
                    privateKeyPath: this.config.get('AWS_PRIVATE_KEY_LOCATION'),
                    expireTime,
                    keypairId,
                },
            );
            return { ok: true, signedUrl: s3UploadSignedUrl };
        } catch (error) {
            console.log(error.message);
            return { ok: false, error: '다운로드 URL을 받아오지 못했습니다.' };
        }
    }

    private async getS3ObjectName(bucket: string): Promise<string> {
        let possibleName;
        let isS3ObjectExists;

        do {
            possibleName = this.randomName();
            isS3ObjectExists = await this.isS3ObjectExists(
                bucket,
                possibleName,
            );
        } while (isS3ObjectExists);

        return `${possibleName}`;
    }

    private randomName(): string {
        return `user-video-${new Date().toISOString()}-${Math.floor(
            Math.random() * 1000,
        )}.webm`.replace(/:/g, '-');
    }

    private async isS3ObjectExists(
        bucket: string,
        key: string,
    ): Promise<boolean> {
        try {
            const data = await this.s3
                .headObject({
                    Bucket: bucket,
                    Key: key,
                })
                .promise();
            return data ? false : true;
        } catch (error) {
            return false;
        }
    }
}
