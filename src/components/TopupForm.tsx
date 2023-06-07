import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Center,
  FormHelperText,
  Flex,
  Badge,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import {
  fetchGlobalUser,
  selectGlobalUser,
} from "@/app/features/user/userSlice";
import { useSelector } from "react-redux";
import HelpCard from "./HelpCard";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/app/firebase";
import { defaultReqConfig } from "@/pages/api/preflight";
import { store } from "@/app/store";

export default function TopupForm() {
  const user = useSelector(selectGlobalUser);
  const { username } = user;
  const router = useRouter();
  const [points, setPoints] = useState(NaN);
  const [file, setFile] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const validate = () => {
    return points > 0 && file !== null;
  };

  const compressImage: any = async (file: any) => {
    const maxSize = 1024 * 1024;

    try {
      const { default: ImageCompressor } = await import("image-compressor.js");
      const compressedFile = await new ImageCompressor().compress(file, {
        maxWidth: 500,
        quality: 0.8,
        mimeType: "image/jpeg",
      });
      if (compressedFile.size <= maxSize) {
        return compressedFile;
      } else {
        return compressImage(compressedFile);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const handleUpload = async () => {
    if (file) {
      const compressedFile = await compressImage(file);
      const storageRef = ref(
        storage,
        `payments/${username}/${file.name}_${new Date().toISOString()}`
      );
      if (compressedFile) {
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);
        return new Promise((resolve, reject) => {
          uploadTask.on("state_changed", (snapshot) => {
            const complete = snapshot.bytesTransferred >= snapshot.totalBytes;
            if (complete) {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((URL) => {
                  resolve(URL);
                })
                .catch((error) => {
                  console.error("Error retrieving URL:", error);
                  reject(error);
                });
            }
          });
        });
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const paymentURI = "api/addPayment";
    const creditURI = "api/creditPoints";
    try {
      const URL = await handleUpload();
      const paymentResponse = await axios.post(
        paymentURI,
        {
          username,
          points,
          screenshot: URL,
        },
        defaultReqConfig
      );
      console.log(paymentResponse.data);
      setPaymentSuccess(true);
      const creditResponse = await axios.post(
        creditURI,
        {
          username,
          pledge: points,
        },
        defaultReqConfig
      );
      console.log(creditResponse.data);
      await store.dispatch(fetchGlobalUser(username));
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err) {
      console.log(err);
      setSubmitting(false);
    }
  };

  const submissionDisabled = !validate() || submitting;

  return (
    <Center w={"90%"} m={25} flexDir={"column"} mb={20}>
      <HelpCard />
      <FormControl>
        <FormLabel mt={"15px"}>Points</FormLabel>
        <FormHelperText mb={"5px"}>
          This is the number of points you would like to top-up.
        </FormHelperText>
        <Input
          id="points"
          type={"number"}
          onChange={(e) => {
            const numericPoints = parseInt(e.target.value);
            setPoints(numericPoints);
          }}
        />
        <FormLabel mt={"15px"}>Payment Screenshot</FormLabel>
        <FormHelperText mb={"5px"}>
          Please upload a screenshot of your successful payment.{" "}
          {isNaN(points)
            ? null
            : `The amount
          should be ${points / 10} SGD.`}
        </FormHelperText>
        <Input
          id="file"
          variant={"unstyled"}
          mt={1}
          type={"file"}
          onChange={(e: any) => {
            e.preventDefault();
            const file = e.target?.files[0];
            setFile(file);
          }}
          disabled={isNaN(points) || points < 1}
        />
        <Flex
          mt={"20px"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Button onClick={handleSubmit} isDisabled={submissionDisabled}>
            {submitting ? <LoadingSpinner /> : "Submit"}
          </Button>
          {paymentSuccess ? (
            <Badge colorScheme={"green"} fontSize={17} variant={"solid"}>
              Payment successful
            </Badge>
          ) : null}
        </Flex>
      </FormControl>
    </Center>
  );
}
