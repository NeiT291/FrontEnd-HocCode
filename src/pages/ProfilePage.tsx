import { useEffect, useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileContent from "@/components/profile/ProfileContent";
import { getMyInfo } from "@/services/api/user.service";
import type { User } from "@/services/api/user.types";

const ProfilePage = () => {
    const [profile, setProfile] = useState<User | null>(null);

    const [mainTab, setMainTab] =
        useState<"joined" | "created">("joined");
    const [subTab, setSubTab] =
        useState<"course" | "practice" | "contest">("course");

    useEffect(() => {
        let mounted = true;

        getMyInfo()
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
