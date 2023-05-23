import { User } from "@/fnshr";
import { Center, Heading } from "@chakra-ui/react";

export type FnshrPointsProps = {
    points: number
}

export default function FnshrPoints({ points }: FnshrPointsProps) {
    return (
        <Center>
            <Heading>
                Fnshr Points: {points}
            </Heading>
        </Center>
    )
}