import { apiClient } from "@/core/api";

export interface MyTestimonial {
  authorName: string;
  position: string;
  text: string;
  rating: number;
  avatarUrl?: string;
  isApproved: boolean;
}

export interface SubmitTestimonialRequest {
  authorName: string;
  position: string;
  text: string;
  rating: number;
  avatarUrl?: string;
}

export const testimonialApi = {
  getMine: (): Promise<MyTestimonial | null> =>
    apiClient.get<MyTestimonial>("/testimonials/mine").catch(() => null),

  submit: (data: SubmitTestimonialRequest): Promise<void> =>
    apiClient.post("/testimonials", data),
};
