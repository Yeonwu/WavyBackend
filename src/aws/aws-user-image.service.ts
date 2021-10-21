import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { Member } from 'src/members/entities/members.entity';
import { GetS3DownloadSignedUrlOutput } from './dtos/get-s3-download-signed-url.dto';
import { GetS3UploadSignedUrlOutput } from './dtos/get-s3-upload-signed-url.dto';

@Injectable()
export class UserImageS3Service {
    constructor(
        @InjectAwsService(S3)
        protected readonly s3: S3,
        protected readonly config: ConfigService,
    ) {}

    async getS3UploadSignedUrl(
        authMember: Member,
        ext: string,
    ): Promise<GetS3UploadSignedUrlOutput> {
        try {
            ext = ext.toLowerCase();

            const bucket = this.config.get('AWS_USER_IMAGE_S3_BUCKET');
            const s3ObjectName = await this.getS3ObjectName(authMember, ext);
            const contentType = `image/${ext}`;

            if (!s3ObjectName) {
                return {
                    ok: false,
                    error: '허용되는 확장자는 jpeg, gif, png, svg, jpg입니다.',
                };
            }
            const params = {
                Bucket: bucket,
                Key: `${s3ObjectName}`,
                Expires: 3600,
                ContentType: contentType,
                ACL: 'public-read',
            };

            const signedUrl = await this.s3.getSignedUrlPromise(
                'putObject',
                params,
            );

            return { ok: true, signedUrl, s3ObjectName };
        } catch (error) {
            console.log(error.stack, error.message);
            return { ok: false, error: 'url을 받아오지 못했습니다.' };
        }
    }

    async getS3DownloadSignedUrl(
        authMember: Member,
    ): Promise<GetS3DownloadSignedUrlOutput> {
        try {
            const bucket = this.config.get('AWS_USER_IMAGE_S3_BUCKET');
            const s3ObjectName =
                authMember.profileImageUrl ??
                this.config.get('DEFAULT_USER_IMAGE');

            const params = {
                Bucket: bucket,
                Key: `${s3ObjectName}`,
                Expires: 3600,
            };

            const signedUrl = await this.s3.getSignedUrlPromise(
                'getObject',
                params,
            );

            return { ok: true, signedUrl };
        } catch (error) {
            console.log(error.stack, error.message);
            return { ok: false, error: 'url을 받아오지 못했습니다.' };
        }
    }

    private getS3ObjectName(member: Member, ext: string) {
        const allowedExt = ['jpeg', 'gif', 'png', 'svg', 'jpg'];
        console.log(ext);
        if (!allowedExt.includes(ext)) {
            return '';
        }
        return member.profileImageUrl ?? `user-${member.mbrSeq}-image.${ext}`;
    }
}
