// "use client";

// import { CircleUserRound, LogOut } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";
// import { Button } from "../ui/button";
// import { logOut } from "@/app/actions/auth.actions";
// import { toast } from "@/hooks/use-toast";
// import { Toggle } from "../ui/toggle";

// export function Profile({ name }: { name: string }) {
//   const handleClick = async () => {
//     try {
//       await logOut();
//       toast({
//         title: "Logout telah berhasil",
//       });
//     } catch (error) {
//       toast({
//         title: "Logout Gagal",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Toggle size="sm">
//           <CircleUserRound />
//         </Toggle>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent className="w-56 mx-4 my-3">
//         <DropdownMenuLabel className="flex justify-center item-center">
//           <CircleUserRound size={35} />
//         </DropdownMenuLabel>
//         <DropdownMenuLabel className="flex justify-center item-center">
//           <span>{name}</span>
//         </DropdownMenuLabel>
//         <DropdownMenuGroup>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem className="flex justify-center item-center">
//             <Button
//               onClick={handleClick}
//               variant="destructive"
//               className="h-8 w-full"
//             >
//               <LogOut />
//               <span>Log out</span>
//             </Button>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
