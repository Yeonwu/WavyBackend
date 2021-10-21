import { Injectable } from '@nestjs/common';
import { Lambda, S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Analysis } from 'src/analyses/entities/analyses.entity';
import { Repository } from 'typeorm';
import { RefVideo } from 'src/ref-videos/entities/ref-video.entity';
import got from 'got';

@Injectable()
export class AwsService {
    constructor(
        @InjectAwsService(S3)
        private readonly s3: S3,
        @InjectAwsService(Lambda)
        private readonly lambda: Lambda,
        @InjectRepository(Analysis)
        private readonly analysisRepo: Repository<Analysis>,
        private readonly config: ConfigService,
    ) {}

    async callUserVideoAnalystApi(
        analysis: Analysis,
        refVideo: RefVideo,
        jwt: string,
    ) {
        try {
            const url = this.config.get('USER_VIDEO_ANALYST_REQ_URL');
            const headers = {
                Authorization: `${jwt}`,
                'Content-Type': 'application/json',
            };
            console.log(refVideo);
            const body = {
                an_seq: analysis.anSeq,
                user_video_filename: analysis.anUserVideoFilename,
                user_sec: analysis.anUserVideoDuration,
                ref_json_filename: refVideo.rvPoseDataUrl.split('.com/')[1],
                ref_sec: refVideo.rvDuration,
            };
            console.log(url);
            console.log(headers);
            console.log(body);

            await got.post(url, {
                headers,
                json: body,
            });

            return true;
        } catch (error) {
            console.log(error.stack, error.message);
            console.log(error.response.body);

            return false;
        }
    }

    async convertWebmToMp4(
        s3ObjectKey: string,
        mirrorEffect: boolean,
    ): Promise<string> {
        const sourceBucket = this.config.get('AWS_UPLOAD_S3_BUCKET');
        const destinationBucket = this.config.get(
            'AWS_USER_VIDEO_DESTINATION_BUCKET',
        );
        const requestBody = {
            body: {
                's3-source-key': s3ObjectKey,
                's3-source-bucket': sourceBucket,
                's3-destination-key': s3ObjectKey.split('.')[0] + '.mp4',
                's3-destination-bucket': destinationBucket,
                'mirror-effect': mirrorEffect,
            },
        };
        const result = await this.lambda
            .invoke({
                FunctionName: 'lambda-convert-webm-to-mp4',
                Payload: JSON.stringify(requestBody),
            })
            .promise();

        console.log(result);
        return s3ObjectKey.split('.')[0] + '.mp4';
    }
}
