import { apiClient } from "@/core/api/client";
import type { ApiResponse } from "@/core/types/api";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useQuery } from "@tanstack/react-query";
import { Activity, AlertCircle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GeoNamesHealthDto {
  webServiceAvailable: boolean;
  lastChecked: string;
  responseTime: number;
  errorMessage?: string;
}

/**
 * GeoNames Health Status Component
 * Displays the health status of the GeoNames web service
 */
export function GeoNamesHealthStatus() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ["geonames", "health"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<GeoNamesHealthDto>>(
        "/locations/geonames/health",
      );
      return response.data.value!;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const getStatusColor = () => {
    if (isLoading) return "default";
    if (error || !data?.webServiceAvailable) return "danger";
    return "success";
  };

  const getStatusIcon = () => {
    if (isLoading) return <Activity className="w-4 h-4" />;
    if (error || !data?.webServiceAvailable)
      return <AlertCircle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isLoading) return t("location.checking");
    if (error) return t("location.connectionError");
    if (!data?.webServiceAvailable) return t("location.serviceUnavailable");
    return t("location.serviceAvailable");
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold">GeoNames Service</h3>
          <Chip
            color={getStatusColor()}
            variant="flat"
            startContent={getStatusIcon()}
            size="sm"
          >
            {getStatusText()}
          </Chip>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="space-y-3">
          <div className="text-sm text-default-600">
            External service for location data and geographical information
          </div>

          {data && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-default-500">Last Checked:</span>
                <span>{new Date(data.lastChecked).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-default-500">Response Time:</span>
                <span>{data.responseTime}ms</span>
              </div>
              {data.errorMessage && (
                <div className="text-sm text-danger">
                  <span className="font-medium">Error:</span>{" "}
                  {data.errorMessage}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="text-sm text-danger">
              Failed to check service status
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
