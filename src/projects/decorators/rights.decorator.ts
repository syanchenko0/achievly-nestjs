import { Reflector } from '@nestjs/core';

export const RightsDecorator = Reflector.createDecorator<string[]>();
