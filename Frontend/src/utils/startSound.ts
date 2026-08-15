
const startSound = new Audio("/sounds/game-start.mp3");
const endSound = new Audio("/sounds/game-end.mp3");


export function PlayStartEndSound(isstart : boolean){

    const sound = isstart ? startSound : endSound;

    sound.currentTime = 0;
    sound.play().catch((err)=>{
        console.log("Sound Blocked !",err);
    });
}