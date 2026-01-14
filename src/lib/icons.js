// 아이콘 매핑 (DB 저장용 문자열 <-> 컴포넌트 변환)
import {
    Gamepad2, Heart, MessageCircle, Coffee, Users, Sparkles, Target, Shield,
    Zap, Crown, MousePointer2, Globe, Mic, Video, Palette, Code, Music
} from 'lucide-react';

export const ICON_MAP = {
    Gamepad2,
    Target,
    Zap,
    Crown,
    Users,
    Sparkles,
    Coffee,
    MousePointer2,
    MessageCircle,
    Globe,
    Mic,
    Video,
    Palette,
    Code,
    Music,
    Heart,
    Shield
};

export const getIcon = (iconName, defaultIcon = Gamepad2) => {
    return ICON_MAP[iconName] || defaultIcon;
};
