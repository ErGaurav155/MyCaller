"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="bg-[#0a0a0a]/60 backdrop-blur-sm border border-[#333]"
          >
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-2 bg-gray-700" />
              <Skeleton className="h-8 w-12 bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-64 w-full bg-gray-700 rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-64 w-full bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
