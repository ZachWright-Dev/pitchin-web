import {
  getGroupMembers,
  getReceiptData,
  getGroupImage,
  getUserImageById,
} from "@/lib/backend-client";
import OverviewClient from "./OverviewClient";

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  // Fetch group-level data in parallel
  const [membersRes, receiptData, groupImage] = await Promise.all([
    getGroupMembers(groupId),
    getReceiptData(groupId),
    getGroupImage(groupId),
  ]);

  // Fetch every member's avatar image in parallel
  const memberImages = await Promise.all(
    membersRes.members.map(async (member) => {
      try {
        const img = await getUserImageById(member.id);
        return { memberId: member.id, ...img };
      } catch {
        return { memberId: member.id, oauth_image: null, image: null, imageType: null };
      }
    })
  );

  // Build a memberId → image-src lookup for the client component
  const memberImageMap: Record<string, string | null> = {};
  for (const mi of memberImages) {
    if (mi.image && mi.imageType) {
      // Backend stores a raw base64 image with its MIME type
      memberImageMap[mi.memberId] = `data:${mi.imageType};base64,${mi.image}`;
    } else if (mi.oauth_image) {
      // OAuth profile picture URL (e.g. Google avatar)
      memberImageMap[mi.memberId] = mi.oauth_image;
    } else {
      memberImageMap[mi.memberId] = null;
    }
  }

  // Resolve group display image (emoji takes priority, then base64 image)
  const groupEmoji = groupImage.emoji ?? null;
  const groupImageSrc =
    groupImage.groupImage && groupImage.groupImageType
      ? `data:${groupImage.groupImageType};base64,${groupImage.groupImage}`
      : null;

  // Build the receipt image data URI if present
  const receiptImageSrc = receiptData.image
    ? receiptData.image // assume the API returns a full data URI or URL
    : null;

  return (
    <OverviewClient
      groupName={receiptData.groupName}
      groupId={groupId}
      members={membersRes.members}
      memberImageMap={memberImageMap}
      receiptData={{
        id: receiptData.id,
        items: receiptData.items,
        subtotal: receiptData.subtotal,
        taxAmount: receiptData.taxAmount,
        tipAmount: receiptData.tipAmount,
        grandTotal: receiptData.grandTotal,
      }}
      receiptImageSrc={receiptImageSrc}
      groupEmoji={groupEmoji}
      groupImageSrc={groupImageSrc}
    />
  );
}