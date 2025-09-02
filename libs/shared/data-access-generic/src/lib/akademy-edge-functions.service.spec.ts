import { TestBed } from '@angular/core/testing';
import { SupabaseService } from '@zambia/data-access-supabase';
import { AkademyEdgeFunctionsService } from './akademy-edge-functions.service';
import { CreateUserRequest, UserCreationResponse } from './akademy-edge-functions.types';

describe('AkademyEdgeFunctionsService', () => {
  let service: AkademyEdgeFunctionsService;
  let mockSupabaseClient: {
    functions: {
      invoke: jest.Mock;
    };
  };

  beforeEach(() => {
    mockSupabaseClient = {
      functions: {
        invoke: jest.fn().mockResolvedValue({ data: null, error: null }),
      },
    };

    const supabaseService = {
      getClient: jest.fn().mockReturnValue(mockSupabaseClient),
    };

    TestBed.configureTestingModule({
      providers: [AkademyEdgeFunctionsService, { provide: SupabaseService, useValue: supabaseService }],
    });

    service = TestBed.inject(AkademyEdgeFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get API status and update signal', async () => {
    const mockResponse = {
      status: 'ok',
      message: 'Akademy API is running',
      timestamp: new Date().toISOString(),
      endpoints: ['/health', '/migrate', '/create-user'],
    };

    mockSupabaseClient.functions.invoke.mockResolvedValue({ data: mockResponse, error: null });

    await service.getApiStatus();

    expect(service.apiStatus()).toEqual(mockResponse);
    expect(service.loading()).toBeFalsy();
    expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith('akademy', {
      body: undefined,
      headers: undefined,
      method: 'GET',
    });
  });

  it('should create user and update signal', async () => {
    const request: CreateUserRequest = {
      agreement_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const mockResponse: UserCreationResponse = {
      user_id: '987fcdeb-51a2-43d1-9c67-123456789abc',
      email: 'test@example.com',
      password: 'TempPass123!',
      headquarter_name: 'Madrid Campus',
      country_name: 'Spain',
      season_name: '2024-2025',
      role_name: 'Student',
    };

    mockSupabaseClient.functions.invoke.mockResolvedValue({ data: { data: mockResponse }, error: null });

    await service.createUser(request);

    expect(service.userCreation()).toEqual(mockResponse);
    expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith('akademy/create-user', {
      body: request,
      headers: undefined,
      method: 'POST',
    });
  });

  it('should handle migration with super password', async () => {
    const superPassword = 'super-secret';
    const mockResponse = {
      success: true,
      statistics: {
        strapiTotal: 100,
        supabaseInserted: 50,
        supabaseUpdated: 30,
        duplicatesSkipped: 20,
      },
      processedData: [],
    };

    mockSupabaseClient.functions.invoke.mockResolvedValue({ data: mockResponse, error: null });

    await service.migrate(superPassword);

    expect(service.migration()).toEqual(mockResponse);
    expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith('akademy/migrate', {
      body: {},
      headers: { 'x-super-password': superPassword },
      method: 'POST',
    });
  });

  it('should handle Supabase function errors and update error signal', async () => {
    const mockError = {
      message: 'Function error',
      context: {
        status: 400,
        json: jest.fn().mockResolvedValue({ error: 'Bad request' }),
      },
    };

    mockSupabaseClient.functions.invoke.mockResolvedValue({ data: null, error: mockError });

    expect(service.error()).toBeTruthy();
  });

  it('should clear error state', () => {
    service.clearError();
    expect(service.error()).toBeNull();
  });

  it('should handle loading state correctly', async () => {
    expect(service.loading()).toBeFalsy();

    mockSupabaseClient.functions.invoke.mockResolvedValue({ data: { status: 'ok' }, error: null });

    const promise = service.getApiStatus();
    expect(service.loading()).toBeTruthy();

    await promise;
    expect(service.loading()).toBeFalsy();
  });

  it('should handle password reset', async () => {
    const request = {
      email: 'user@example.com',
      document_number: '12345678A',
      new_password: 'NewPassword123!',
      phone: '+34123456789',
      first_name: 'John',
      last_name: 'Doe',
    };

    const mockResponse = {
      message: 'Password successfully updated',
      new_password: 'NewPassword123!',
      user_email: 'user@example.com',
    };

    mockSupabaseClient.functions.invoke.mockResolvedValue({ data: { data: mockResponse }, error: null });

    await service.resetPassword(request);

    expect(service.passwordReset()).toEqual(mockResponse);
    expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith('akademy/reset-password', {
      body: request,
      headers: undefined,
      method: 'POST',
    });
  });

  it('should handle user deactivation', async () => {
    const request = {
      user_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    const mockResponse = {
      message: 'User has been deactivated',
      user_id: '123e4567-e89b-12d3-a456-426614174000',
    };

    mockSupabaseClient.functions.invoke.mockResolvedValue({ data: { data: mockResponse }, error: null });

    await service.deactivateUser(request);

    expect(service.userDeactivation()).toEqual(mockResponse);
    expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith('akademy/deactivate-user', {
      body: request,
      headers: undefined,
      method: 'POST',
    });
  });
});
