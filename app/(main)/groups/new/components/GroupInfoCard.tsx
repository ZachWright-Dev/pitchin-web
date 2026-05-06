import { Card } from "./Card";
import { IconPhoto } from "./icons";

export function GroupInfoCard({
  groupName,
  setGroupName,
  groupPhoto,
  groupPhotoUrl,
  groupPhotoRef,
  onPickPhoto,
}: {
  groupName: string;
  setGroupName: (v: string) => void;
  groupPhoto: File | null;
  groupPhotoUrl: string | null;
  groupPhotoRef: React.RefObject<HTMLInputElement | null>;
  onPickPhoto: (f: File) => void;
}) {
  return (
    <Card>
      <div className="mb-5">
        <label className="mb-1.5 block text-sm font-semibold">Group Name</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="e.g. Nobu Dinner"
          className="w-full rounded-xl border border-[#0F1A3D]/15 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold">
          Group photo{" "}
          <span className="font-normal text-[#0F1A3D]/45">(optional)</span>
        </label>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#0F1A3D]/10 bg-[#FAFBFF]">
            {groupPhotoUrl ? (
              <img
                src={groupPhotoUrl}
                alt="Group"
                className="h-full w-full object-cover"
              />
            ) : (
              <IconPhoto />
            )}
          </div>
          {groupPhoto && (
            <span className="min-w-0 flex-1 truncate text-sm text-[#0F1A3D]/55">
              {groupPhoto.name}
            </span>
          )}
          <button
            onClick={() => groupPhotoRef.current?.click()}
            className="ml-auto shrink-0 rounded-xl border border-[#0F1A3D]/15 bg-white px-5 py-2 text-sm font-semibold transition hover:bg-[#0F1A3D]/5"
          >
            {groupPhoto ? "Replace" : "Upload"}
          </button>
          <input
            ref={groupPhotoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPickPhoto(f);
            }}
          />
        </div>
      </div>
    </Card>
  );
}
