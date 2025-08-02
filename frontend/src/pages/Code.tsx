import { useParams } from "react-router-dom"
import Ide from "../components/Ide"


export default function Code(){
    let {roomId} = useParams();
    return <div>
        <Ide roomId={roomId!}/>
    </div>
}