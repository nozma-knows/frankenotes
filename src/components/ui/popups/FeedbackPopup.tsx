import { useState, MouseEventHandler } from "react";
import Image from "next/image";
import { useForm, FieldValues } from "react-hook-form";
import useWindowSize from "@/components/utils/hooks/useWindowSize";
import Popup from "./Popup";
import { TextField } from "../form-fields";
import Button from "../buttons/Button";
import SendSlackMessage from "@/components/utils/tools/SendSlackMessage";

interface FeedbackPopupProps {
  onClose: MouseEventHandler<HTMLButtonElement>;
}

export default function FeedbackPopup({ onClose }: FeedbackPopupProps) {
  const screenSize = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [successfullySent, setSuccessfullySent] = useState(false);

  // React Hook Form variables
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FieldValues>();

  const onSubmit = (data: FieldValues) => {
    setLoading(true);
    const message = data.feedback;
    SendSlackMessage(message).then(() => {
      setValue("feedback", "");
      setLoading(false);
      setSuccessfullySent(true);
      console.log("Message sent!");
    });
  };

  return (
    <Popup
      style={{
        backgroundColor: "#061515",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "12px",
        padding: "1rem",
        width: screenSize.width > 1024 ? "65%" : "90%",
      }}
      onClose={onClose}
    >
      <div className="flex flex-col w-full h-full items-center justify-between p-2 gap-4">
        <h1 className="text-main-dark">Share your feedback!</h1>
        {!successfullySent ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full items-center"
          >
            <TextField
              control={control}
              name="feedback"
              type="text"
              multiline
              minRows={8}
              placeholder="Share your feedback here"
              required="No feedback provided."
              errors={errors}
            />
            <Button label="Share" className="w-fit" loading={loading} />
          </form>
        ) : (
          <>
            <div className="flex relative w-48 h-48">
              <Image
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGUwOTEyMzEyZThiZDM3NmZjNWFhMjBkYTIyYjZjMjdlZjUxNDFiMSZjdD1n/fxI1G5PNC5esyNlIUs/giphy.gif"
                alt="Thank you gif."
                fill
                className="rounded-xl"
              />
            </div>
            <h2 className="text-main-dark">
              Thank you for sharing your feedback with us!
            </h2>
          </>
        )}
      </div>
    </Popup>
  );
}
