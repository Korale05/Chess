
const moveSound = new Audio("/sounds/move-self.mp3");
const captureSound = new Audio("/sounds/capture.mp3");
const checkSound = new Audio("/sounds/illegal.mp3");


export function playMoveSound(moveResult : {captured? : string} | null,isCheck? : boolean){

    //picking sound based on result 

    const sound = isCheck ? checkSound : moveResult?.captured ? captureSound : moveSound;

    sound.currentTime = 0;
    sound.play().catch((err)=>{
        console.log("Sound Blocked !",err);
    });
}
