import LocalStorageUtil from '../util/LocalStorageUtil';
import { ThemeDesc, ThemeType, TopicStyle } from './Theme';
import ThemeDefDefault from './ThemeDefDefault';
import ThemeDefSimple from './ThemeDefSimple';
import log,{Logger} from 'loglevel';
import { ThemeCurrentInstance } from './ThemeCurrent';

export enum LevelType {
    ROOT = 1,
    PRIMARY = 2,
    NORMAL = 3,
}


export class ThemeManager {
    logger:Logger = log.getLogger("ThemeManager");
    themeCacheKey: string = "key_theme";
    themeNameDefault: string = "default";

    themes: Map<string, ThemeType> = new Map<string, ThemeType>();
    themeList: ThemeDesc[] = [];
    themeName: string;
    themeTypeCache:ThemeType|undefined;   //这里保存一份缓存

    initial(){
        this.themes.forEach((theme:ThemeType)=>{
            this.themeList.push(theme.themeDesc);
        });
    }

    /**
     * 这里是外界获取主题的唯一出口
     * @param themeName 
     */
    getTheme(): ThemeType {
        let themeType;
        if(this.themeTypeCache != undefined){
            themeType = this.themeTypeCache;
        }else{
            let themeName = this.themeName || this.themeNameDefault;
            themeType = JSON.parse(JSON.stringify(this.themes.get(themeName)!));//进行拷贝，避免对象里面数据被篡改
        }
        return ThemeCurrentInstance.merge(themeType);
    }

    /**
     * 清除掉缓存，下次需要重新获取最新的
     */
    clearTheme(){
        this.themeTypeCache = undefined;
    }


    /**
     * 获得缓存的主题，如果没有，则使用默认主题
     */
    getThemeName() {
        if (this.themeName == undefined) {
            let val = LocalStorageUtil.getItem(this.themeCacheKey);
            if (val != undefined) {
                if (this.isExistsTheme(val)) {
                    this.themeName = val;
                } else {
                    LocalStorageUtil.removeItem(this.themeCacheKey);
                }

            } else {
                this.themeName = this.themeNameDefault;
            }
        }
        return this.themeName;
    }

    /**
     * 检查主题是否存在
     * @param themeName 
     */
    isExistsTheme(themeName: string) {
        if(this.themes.has(themeName)){
            return true;
        }
        return false;
    }

    /**
     * 获得主题的显示列表定义数据
     */
    getThemeDesc(): ThemeDesc {
        let themeName = this.getThemeName();
        this.logger.debug("获得主题", themeName);
        let theme = this.themes.get(themeName)!;
        return theme.themeDesc;
    }

    /**
     * 设置缓存主题
     * @param themeName 
     */
    setCacheTheme(themeName: string) {
        this.logger.debug("设置主题", themeName);
        if(this.isExistsTheme(themeName)){
            LocalStorageUtil.setItem(this.themeCacheKey, themeName);
            this.themeName = themeName;
            return true;
        }
        return false;
    }

    /**
     * 根据级别获得主题样式 1root,2primary
     * @param level 
     */
    getTopicStyle(level: LevelType): TopicStyle {
        var theme: ThemeType = this.getTheme();
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

    getSubTopicStyle(level: LevelType): TopicStyle {
        level++;
        if (level > LevelType.NORMAL) {
            level = LevelType.NORMAL;
        }
        return this.getTopicStyle(level);
    }
}

export const ThemeManagerInstance = new ThemeManager();

ThemeManagerInstance.themes.set(ThemeDefDefault.themeDesc.id, ThemeDefDefault as ThemeType);
ThemeManagerInstance.themes.set(ThemeDefSimple.themeDesc.id, ThemeDefSimple as ThemeType);

ThemeManagerInstance.initial();

console.log("ThemeManagerInstance.initial");


