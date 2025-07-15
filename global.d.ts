
declare global {
    interface UserProfileData {
        _id: string,
        email: string
    }
    interface CustomError {
        data: {
            success: boolean;
            error_code: number;
            message: string;
        };
    }

    interface ApiResponse<T> {
        data: T;
        message: string;
        success: boolean;
    }
      interface ApiResponseList<T> {
        data: {
          list: T[],
          total: number
        };
        message: string;
        success: boolean;
    }

    interface UserRecord {
        _id: string,
        name: string,
        image: string
    }

    interface PaginationQuery {
        skip: number;
        limit: number;
    }
    interface BaseSchema {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
interface IBank {
  userId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch?: string;
  upiId?: string;
  isDefault?: boolean;
}
type BadgeType = "green" | "yellow";


enum ProviderType {
  GOOGLE = "google",
  MANUAL = "manual",
  FACEBOOK = "facebook",
  APPLE = "apple",
  LINKEDIN = "linkedin",
}
interface IUser extends BaseSchema {
  name?: string;
  email: string;
  active?: boolean;
  role: "USER" | "ADMIN";
  password?: string;
  refreshToken?: string;
  blocked?: boolean;
  blockReason?: string;
  provider: ProviderType;
  facebookId?: string;
  image?: string;
  linkedinId?: string;

  referrerId?: string | null;
  bankDetails?: Partial<IBank> | null;
  badgeType: BadgeType;
  totalEarnings?: number;
  directReferralCount?: number;
  isPayoutEligible?: boolean;
  otp?: number
}
}
export { }