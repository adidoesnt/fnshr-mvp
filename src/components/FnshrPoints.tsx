import { Center, Heading } from "@chakra-ui/react";

export type FnshrPointsProps = {
    points: number
}

export default function FnshrPoints({ points }: FnshrPointsProps) {
    return (
        <Center w={"90%"} m={50}>
            <Heading>
                Fnshr Points: {points}
            </Heading>
        </Center>
    )
}