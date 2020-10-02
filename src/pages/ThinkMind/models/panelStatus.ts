interface IState{
    leftPanel: boolean;
    rightPanel: boolean;
    topPanel: boolean;
};

export default {
    state: {
        leftPanel: true,
        rightPanel: true,
        topPanel: true,
    },
  
    reducers: {
        setPanelStatus(prevState: IState, panelName:string){
            prevState[panelName] = !prevState[panelName];
        }
    },
  
    effects: (dispatch) => ({})
}