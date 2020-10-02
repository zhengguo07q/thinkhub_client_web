import { SceneContext } from '../util/Interface';

export abstract class ContextHolder{
    protected static instance:any = null;
    protected sceneContext:SceneContext;

    static build<T extends ContextHolder>(c:{new():T}, sceneContext:SceneContext):T{
        if(this.instance != null){
            return this.instance;
        }
        var interaction:T = new c()
        interaction.sceneContext = sceneContext;
        interaction.initialize();
        this.instance = interaction;
        return interaction;
    }

    static getInstance<T extends ContextHolder>():T{
        return this.instance;
    }

    abstract initialize();
    abstract destory();
}
