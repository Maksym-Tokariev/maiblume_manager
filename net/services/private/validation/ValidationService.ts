import {Logger} from "../../../utils/Logger";
import {CreateFlowSteps} from "../../../enums/CreateFlowSteps";
import {ValidationDTO} from "../../../models/ValidationDTO";
import {timeRegExp} from "../../../utils/RegExp";
import {Texts} from "../../../utils/Texts";

export class ValidationService {
    private readonly logger = new Logger(ValidationService.name);

    public async validate(input: any, step: CreateFlowSteps): Promise<ValidationDTO> {
        if (!input) {
            return { valid: false, error: "Empty input" };
        }
        this.logger.debug('Validation value: ', input);

        switch (step) {
            case CreateFlowSteps.MEMBERS:
                this.logger.debug('Validation time');
                return await this.validateTime(input);

            case CreateFlowSteps.DESCRIPTION:
                this.logger.debug('Validation members');
                return await this.validateMembers(input);
        }
        return { valid: false, error: "Validation error" };
    }


    private async validateTime(time: string): Promise<ValidationDTO> {
        if (!timeRegExp.test(time)) {
            return {valid: false, error: Texts.validation.invalidName}
        }
        return { valid: true, value: { time: time }};
    }

    private async validateMembers(members: string[]): Promise<ValidationDTO> {
        for (const member of members) {
            if (!member.startsWith('@'))
                return {valid: false, error: Texts.validation.invalidUsername};
        }
        return { valid: true, value: { members: members }};
    }
}