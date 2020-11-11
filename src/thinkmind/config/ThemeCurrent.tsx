import { ThemeType } from "./Theme";
import { ThemeManagerInstance } from "./ThemeManager"
/**
 * 用来保存当前不根主题在一起的一些设置，这些设置，只有在主题变更时才被变更
 * 为解决更换主题引起的问题
 */
class ThemeCurrent{
    backgroundColor:string|undefined;

    setBackgroundColor(val:string){
        this.backgroundColor = val;
    }

    clearCurrent(){
        this.backgroundColor = undefined;
    }

    useTheme(name:string){
        let isCache = ThemeManagerInstance.setCacheTheme(name);
        ThemeManagerInstance.clearTheme();
        if(isCache){
            this.clearCurrent();
        }
    }

    merge(theme:ThemeType){
        if(this.backgroundColor != undefined){
            theme.background = this.backgroundColor.toString();
        }
        return theme;
    }
}

export const ThemeCurrentInstance = new ThemeCurrent();