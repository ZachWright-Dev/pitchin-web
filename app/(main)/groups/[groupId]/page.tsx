import { redirect } from "next/navigation";

export default async function GroupRootPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  redirect(`/groups/${groupId}/overview`);
}