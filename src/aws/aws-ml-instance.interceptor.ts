import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EC2 } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { Observable } from 'rxjs';

@Injectable()
export class StartMLInstanceInterceptor implements NestInterceptor {
    static instanceId: string;

    constructor(
        @InjectAwsService(EC2)
        private readonly ec2Service: EC2,
        private readonly config: ConfigService,
    ) {
        StartMLInstanceInterceptor.instanceId =
            this.config.get('AWS_ML_INSTANCE_ID');
    }
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        this.startInstance();
        return next.handle();
    }

    async startInstance() {
        const instanceStatusResult = await this.ec2Service
            .describeInstances({
                DryRun: false,
                InstanceIds: [StartMLInstanceInterceptor.instanceId],
            })
            .promise();

        if (instanceStatusResult.$response.error) {
            const error = instanceStatusResult.$response.error;
            const errString = `${error.name}(${error.code}): ${error.message}`;
            throw Error(errString);
        }

        const mlInstance = instanceStatusResult.Reservations[0].Instances[0];
        const instanceState = mlInstance.State.Name;

        if (instanceState == 'stopping') {
            this.startWhileStopping();
        } else if (instanceState == 'stopped') {
            this.start();
        } else if (
            instanceState == 'terminated' ||
            instanceState == 'shutting-down'
        ) {
            throw new Error(`!!! MLInstance is ${instanceState}. !!!`);
        }
    }

    private async start() {
        const result = await this.ec2Service
            .startInstances({
                DryRun: false,
                InstanceIds: [StartMLInstanceInterceptor.instanceId],
            })
            .promise();
        return result.StartingInstances[0].InstanceId;
    }
    private async startWhileStopping() {
        await this.ec2Service
            .waitFor('instanceStopped', {
                DryRun: false,
                InstanceIds: [StartMLInstanceInterceptor.instanceId],
                $waiter: {
                    delay: 3,
                },
            })
            .promise();
        return await this.start();
    }
}
