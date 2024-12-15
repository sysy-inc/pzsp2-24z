import { useParams } from "react-router";
import { Button } from "./ui/button";

type PlatformInfoParams = {
    platformId: string;
}

export default function PlatformInfo() {
    const params = useParams<PlatformInfoParams>();

    return <div>{params.platformId}olek<Button>olek</Button></div>
}
