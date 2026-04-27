import { getCurrentUser } from "@/lib/auth";
import HomeContent from "./home-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <HomeContent user={user} />
  );
}


