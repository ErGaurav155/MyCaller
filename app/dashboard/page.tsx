// import { Suspense } from "react";
// import { connectToDatabase } from "@/lib/database/mongoose";
// import { Lead } from "@/lib/database/models/lead.model";
// import { User } from "@/lib/database/models/user.model";

// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { redirect } from "next/navigation";
// import { auth } from "@clerk/nextjs";
// import { DashboardData } from "@/types";
// import DashboardContent from "@/components/dashboard/DashboardContent";
// import { DashboardSkeleton } from "@/components/dashboard/DashSkeleton";

// const DEMO_USER_ID = "684eb625b30670b468652a10";

// const getLeads = async (): Promise<DashboardData> => {
//   try {
//     await connectToDatabase();

//     const user = await User.findOne({ _id: DEMO_USER_ID });

//     const leads = await Lead.find({ businessOwner: DEMO_USER_ID })
//       .sort({ createdAt: -1 })
//       .lean()
//       .exec();
//     const serializedUser = {
//       _id: user._id.toString(),
//       clerkId: user.clerkId || "",
//       firstName: user.firstName || "",
//       lastName: user.lastName || "",
//       photo: user.photo || "",
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       twilioNumber: user.twilioNumber,
//       isActive: user.isActive,
//       aiSettings: {
//         greeting: user.aiSettings.greeting,
//         questions: [...user.aiSettings.questions],
//         businessInfo: user.aiSettings.businessInfo,
//       },
//       createdAt: user.createdAt.toISOString(),
//       updatedAt: user.updatedAt.toISOString(),
//     };
//     // const serializedUser = {
//     //   ...user.toObject(),
//     //   _id: user._id.toString(),
//     //   createdAt: user.createdAt.toISOString(),
//     //   updatedAt: user.updatedAt.toISOString(),
//     //   aiSettings: {
//     //     ...user.aiSettings,
//     //     // Ensure nested objects are plain
//     //   },
//     // };
//     return {
//       leads: leads.map((lead) => ({
//         ...lead,
//         _id: lead._id as string,
//         phone: lead.phone || "",
//         callSid: lead.callSid || "",
//         status: lead.status || "pending",
//         businessOwner: lead.businessOwner.toString(),
//         createdAt: lead.createdAt.toISOString(),
//         updatedAt: lead.updatedAt.toISOString(),
//       })),
//       user: serializedUser,
//     };
//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//     return {
//       leads: [],
//       user: null,
//       error: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// };

// const DashboardPage = async () => {
//   const { userId } = auth();

//   if (!userId) {
//     redirect("/sign-in");
//   }

//   const data = await getLeads();
//   return (
//     <div className="min-h-screen bg-[#0a0a0a]">
//       <div className="bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-[#333]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-5 w-full">
//             <Link
//               href="/"
//               className="flex items-center gap-2 text-white border border-gray-400 p-2 rounded-md hover:border-[#00F0FF] transition-colors"
//             >
//               <ArrowLeft className="h-5 w-5 text-white" /> Go Home
//             </Link>
//             <div>
//               <h1 className="text-xl lg:text-2xl font-bold text-white">
//                 AI Call Assistant Dashboard
//               </h1>
//               <p className="text-gray-400 mt-1 font-mono">
//                 Manage your leads and monitor your AI assistant performance
//               </p>
//             </div>
//             <div className="hidden lg:flex items-center gap-2">
//               <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
//               <span className="text-sm text-gray-400">System Active</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Suspense fallback={<DashboardSkeleton />}>
//           <DashboardContent initialData={data} />
//         </Suspense>
//       </main>
//     </div>
//   );
// };
// export default DashboardPage;
import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
