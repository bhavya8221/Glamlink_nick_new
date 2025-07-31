"use client";

import Image from "next/image";
import Link from "next/link";
import DownloadDialog from "./DownloadDialog";

interface UserDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDownloadDialog({ isOpen, onClose }: UserDownloadDialogProps) {
  return (
    <DownloadDialog isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="text-6xl mb-6">👩‍🦰</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Glamlink - your new favorite beauty app</h2>

        <p className="text-gray-700 mb-8">Discover trusted beauty professionals near you. Book with ease, and shop expert-approved products - all in one place.</p>

        <p className="text-lg font-semibold text-gray-900 mb-6">Get the full experience — download the app:</p>

        <div className="space-y-3">
          <Link href="https://apps.apple.com/us/app/glamlink/id6502334118" target="_blank" className="inline-block mr-4">
            <Image src="/images/apple_app_icon.png" alt="Download on the App Store" width={150} height={45} className="hover:opacity-90 transition-opacity" />
          </Link>

          <Link href="https://play.google.com/store/apps/details?id=com.glamlinkUser" target="_blank" className="inline-block">
            <Image src="/images/google_app_icon.png" alt="Get it on Google Play" width={150} height={45} className="hover:opacity-90 transition-opacity" />
          </Link>
        </div>
      </div>
    </DownloadDialog>
  );
}
