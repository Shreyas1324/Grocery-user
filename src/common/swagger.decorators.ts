import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiNonAuthHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'language',
      description: 'Enter language',
      required: true,
    }),
    ApiHeader({
      name: 'app_version',
      description: 'Enter app_version',
      required: true,
    }),
    ApiHeader({
      name: 'device_type',
      description: 'Enter device_type',
      required: true,
    }),
    ApiHeader({
      name: 'os',
      description: 'Enter os',
      required: true,
    }),
    ApiHeader({
      name: 'device_id',
      description: 'Enter device_id',
      required: true,
    }),
    ApiHeader({
      name: 'device_token',
      description: 'Enter device_token',
      required: true,
    }),
  );
}

export function ApiAuthHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'language',
      description: 'Enter language',
      required: true,
    }),
    ApiHeader({
      name: 'authorization',
      description: 'Enter access-token',
      required: true,
    }),
    ApiHeader({
      name: 'app_version',
      description: 'Enter app_version',
      required: true,
    }),
    ApiHeader({
      name: 'device_type',
      description: 'Enter device_type',
      required: true,
    }),
    ApiHeader({
      name: 'os',
      description: 'Enter os',
      required: true,
    }),
    ApiHeader({
      name: 'device_id',
      description: 'Enter device_id',
      required: true,
    }),
    ApiHeader({
      name: 'device_token',
      description: 'Enter device_token',
      required: true,
    }),
  );
}

export function ApiRefreshHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'language',
      description: 'Enter language',
      required: true,
    }),
    ApiHeader({
      name: 'app_version',
      description: 'Enter app_version',
      required: true,
    }),
    ApiHeader({
      name: 'device_type',
      description: 'Enter device_type',
      required: true,
    }),
    ApiHeader({
      name: 'os',
      description: 'Enter os',
      required: true,
    }),
    ApiHeader({
      name: 'device_id',
      description: 'Enter device_id',
      required: true,
    }),
    ApiHeader({
      name: 'refresh_token',
      description: 'Enter refresh_token',
      required: false,
    }),
    ApiHeader({
      name: 'device_token',
      description: 'Enter device_token',
      required: true,
    }),
  );
}
