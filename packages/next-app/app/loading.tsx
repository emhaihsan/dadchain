import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/dadchain.png"
          alt="Loading DadChain"
          width={96}
          height={96}
          className="animate-pulse"
          priority
        />
        <p className="text-lg font-semibold text-gray-600">Loading Page...</p>
      </div>
    </div>
  );
}
