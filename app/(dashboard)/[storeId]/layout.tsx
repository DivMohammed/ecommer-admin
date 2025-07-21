// import { auth } from "@clerk/nextjs";
// import { redirect } from "next/navigation";

// import prismadb from "@/lib/prismadb";
// import Navbar from "@/components/navbar";



// export default async function DashboardLayout({
//     children,
//     params
// }: {
//     children: React.ReactNode;
//     params: { storeId: string }
// }) {

//     const { userId } = auth();


//     if (!userId){
//         redirect('/sign-in')
//     }


//     const store = await prismadb.store.findFirst({
//         where: {
//             id: params.storeId,
//             userId
//         }
//     });

//     if (!store){
//         redirect('/');
//     }

// return (
//     <>
//         <Navbar />
//         {children}
//     </>
// )
// }




import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import Navbar from "@/components/navbar";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId
    }
  });

  if (!store) {
    redirect("/");
  }

  const stores = await prismadb.store.findMany({
      where: {
        userId,
      }
    })



  return (
     <SidebarProvider defaultOpen={false}>
      <AppSidebar stores ={stores}/>
      <main className="w-full">
        <SidebarTrigger className="p-1"/>
        {children}
      </main>
    </SidebarProvider>
  );
}