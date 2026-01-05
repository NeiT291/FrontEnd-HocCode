import { useEffect, useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileContent from "@/components/profile/ProfileContent";
import { getMyProfile } from "@/services/api/profile.service";
import type { UserProfile } from "@/services/api/profile.types";

const ProfilePage = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const [mainTab, setMainTab] =
        useState<"joined" | "created">("joined");
    const [subTab, setSubTab] =
        useState<"course" | "class" | "practice" | "contest">("course");

    useEffect(() => {
        let mounted = true;

        getMyProfile()
            .then((data) => {
                console.log("Fetched profile:", data);

                if (mounted) setProfile(data);
            })
            .catch(() => {
                if (mounted) setProfile(null);
            });

        return () => {
            mounted = false;
        };
    }, []);

    if (!profile) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-16 text-gray-500">
                Đang tải hồ sơ...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-16">
            <ProfileHeader profile={profile} />

            <ProfileTabs
                mainTab={mainTab}
                subTab={subTab}
                onChangeMain={setMainTab}
                onChangeSub={setSubTab}
            />

            <ProfileContent
                mainTab={mainTab}
                subTab={subTab}
            />
        </div>
    );
};

export default ProfilePage;
