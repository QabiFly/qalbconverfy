import { Construction } from "lucide-react";

/**
 * Rendered wherever a UI affordance exists but no corresponding
 * endpoint is present in api_endpoints.txt. Per the build rules: if a
 * needed feature has no backend route, the UI must say so explicitly
 * rather than fall back to a mock or invented call.
 */
export function FeatureUnavailable({ feature }: { feature: string }) {
  return (
    <div className="flex min-h-[30vh] w-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning">
        <Construction className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-text-primary">
        Backend endpoint not available yet
      </h3>
      <p className="max-w-sm text-sm text-text-secondary">
        {feature} is not yet supported by the backend API. This will become available
        once the corresponding endpoint is added.
      </p>
    </div>
  );
}