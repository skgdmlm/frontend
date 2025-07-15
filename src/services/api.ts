import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getItemLocalStorage, handleSessionExpire, handleSetLocalStorage } from '../utils/functions'
import { toast } from 'react-hot-toast';

import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { TokenType } from '../utils/enums';

export const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BE_BASE_URL}/api`,
    prepareHeaders: (headers) => {
      const accessToken = getItemLocalStorage(TokenType.ACCESS_TOKEN);
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      return headers;
    },
  });

  const response = await rawBaseQuery(args, api, extraOptions);

  if (!response.error && response.data) {
    return response;
  }
  if (response && response.error) {
    const customError = response.error as CustomError;
    if (
      customError.data?.message === 'Token expired' ||
      customError.data?.message === 'jwt malformed'
    ) {
      try {
        const refreshToken = getItemLocalStorage(TokenType.REFRESH_TOKEN);
        const refreshResponse = await rawBaseQuery(
          { method: 'POST', url: '/users/refresh-token', body: { refreshToken } },
          api,
          extraOptions,
        );
        const refreshData = refreshResponse?.data as OtpResponse;
        if (!refreshData?.success) {
          throw new Error('Refresh token failed');
        }
        handleSetLocalStorage(TokenType.ACCESS_TOKEN, refreshData.data.accessToken);
        handleSetLocalStorage(TokenType.REFRESH_TOKEN, refreshData.data.refreshToken);
        return await rawBaseQuery(args, api, extraOptions);
      } catch {
        toast.error('Session expired please login again.');
        handleSessionExpire();
        return response;
      }
    }
    return response;
  }
  return response;
};
enum Tags {
  User = 'user',
  Balance = 'balance'
}
type LoginResponse = ApiResponse<{ otp: number; }>;
interface LoginRequest {
  email: string;
  password: string;
}
type RegisterResponse = ApiResponse<{ message: string }>;
interface RegisterRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
type ProfileResponse = ApiResponse<UserProfileData>;
type OtpResponse = ApiResponse<{ accessToken: string; refreshToken: string }>;
interface OtpRequest { otp: number; email: string };
interface InviteRequest {
  emails: string[]
  badgeType?: string
}
interface TreeNode {
  id: string,
  name: string,
  attributes: {
    badge: string,
  },
  email: string
}
interface ReferralTreeResponse extends TreeNode {
  referrals: TreeNode[] | null;
}
enum TransactionType {
  COMMISSION = "COMMISSION",
  PAYOUT = "PAYOUT"
}

enum TransactionStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  PENDING = "PENDING",
  REJECTED = "REJECTED"
}

interface Transaction {
  userId: string;
  type: TransactionType;
  balance: number;
  lastAmountAdded: number;
  referenceId?: string;
  status?: TransactionStatus;
  description?: string
}


interface Commission {
  earnerId: IUser;
  referredUserId: IUser;
  level: number;
  amount: number;
  isPaid?: boolean;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: [...Object.values(Tags)],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: 'users/verify-invitation',
        method: 'POST',
        body: credentials,
      }),
    }),
    verifyOtp: builder.mutation<OtpResponse, OtpRequest>({
      query: (credentials) => ({
        url: 'users/verify-otp',
        method: 'POST',
        body: credentials,
      }),
    }),
    profile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: 'users/me',
        method: 'GET'
      }),
    }),
    inviteUsers: builder.mutation<void, InviteRequest>({
      query: (credentials) => ({
        url: 'users/invite',
        method: 'POST',
        body: credentials,
      }),
    }),
    referralTree: builder.query<ApiResponse<ReferralTreeResponse>, void>({
      query: () => ({
        url: 'users/tree',
        method: 'GET'
      }),
    }),
    totalCommission: builder.query<ApiResponse<number>, {id?: string}>({
      query: ({id}) => ({
        url: 'commission/total',
        method: 'GET',
        params: {id}
      }),
    }),
    balance: builder.query<ApiResponse<number>, {id?: string}>({
      query: ({id}) => ({
        url: 'transaction/balance',
        method: 'GET',
        params: {id}
      }),
      providesTags: [Tags.Balance]
    }),
    transactions: builder.query<ApiResponseList<Transaction>, { skip: number, limit: number }>({
      query: ({ skip, limit }) => ({
        url: 'transaction',
        method: 'GET',
        params:
        {
          skip, limit
        }
      }),
    }),
    commissions: builder.query<ApiResponseList<Commission>, { skip: number, limit: number }>({
      query: ({ skip, limit }) => ({
        url: 'commission',
        method: 'GET',
        params:
        {
          skip, limit
        }
      }),
      providesTags: [Tags.Balance]
    }),
    personalDetails: builder.query<ApiResponse<IUser & { bankDetails: IBank }>, void>({
      query: () => ({
        url: 'users/profile',
        method: 'GET',
      }),
    }),
       updateUser: builder.mutation<void, Partial<IUser>>({
      query: (credentials) => ({
        url:  `users/${credentials._id}`,
        method: 'PATCH',
        body: credentials,
      }),
    }),
     users: builder.query<ApiResponseList<IUser>, { skip: number, limit: number, search?: string | null }>({
      query: ({ skip, limit, search }) => ({
        url: 'users',
        method: 'GET',
        params:
        {
          skip, limit, search
        }
      }),
    }),
     userDetails: builder.query<ApiResponse<IUser & { bankDetails: IBank }>, {id: string}>({
      query: ({id}) => ({
        url:  `users/${id}`,
        method: 'GET',
      }),
    }),
       payout: builder.mutation<void, {amount: number, userId: string}>({
      query: ({amount,userId}) => ({
        url:  `payout`,
        method: 'POST',
        body: {amount, userId},
      }),
      invalidatesTags: [Tags.Balance]
    }),
  }),
});
export const {
  useLoginMutation,
  useRegisterMutation,
  useProfileQuery,
  useVerifyOtpMutation,
  useInviteUsersMutation,
  useReferralTreeQuery,
  useTotalCommissionQuery,
  useBalanceQuery,
  useTransactionsQuery,
  useCommissionsQuery,
  usePersonalDetailsQuery,
  useUpdateUserMutation,
  useUsersQuery,
  useUserDetailsQuery,
  usePayoutMutation

} = api;
