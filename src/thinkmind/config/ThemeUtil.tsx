import { ThemeType, TopicStyle } from './Theme';
import ThemeDefault from './ThemeDefault';

export enum LevelType {
    ROOT,
    PRIMARY,
    NORMAL,
}

export class ThemeUtil {
    static themes: Map<string, ThemeType> = new Map<string, ThemeType>();

    static getTheme(themeName?: string): ThemeType {
        themeName = themeName || 'defaultTheme';
        return ThemeUtil.themes.get(themeName)!;
    }

    /**
     * 根据级别获得主题样式 1root,2primary
     * @param level 
     */
    static getTopicStyle(level: LevelType): TopicStyle {
        var theme: ThemeType = ThemeUtil.getTheme();
        var topicStyle: TopicStyle;

        if (level == 1) {
            topicStyle = theme.rootTopic!;
        } else if (level == 2) {
            topicStyle = theme.primaryTopic!;
        } else {
            topicStyle = theme.normalTopic!;
        }

        return topicStyle;
    }

    static getSubTopicStyle(level: LevelType): TopicStyle {
        level++;
        if (level > LevelType.NORMAL) {
            level = LevelType.NORMAL;
        }
        return this.getTopicStyle(level);
    }
}

ThemeUtil.themes.set('defaultTheme', ThemeDefault as ThemeType);