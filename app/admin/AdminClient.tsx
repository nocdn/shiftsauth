"use client"
import { useRef, useState } from "react"
import LightningIcon from "@/components/LightningIcon"
import { Cropper, type CropperRef } from "react-advanced-cropper"
import "react-advanced-cropper/dist/style.css"
import { Calendar, LogOut, User, CornerDownRight } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import HoldConfirm from "@/components/HoldConfirm"
import { authClient } from "@/lib/auth-client"

export default function Admin() {
  function handleManageRota() {
    console.log("manage rota")
  }

  function handleSwitchToUser() {
    console.log("switch to user")
  }

  const [file, setFile] = useState<File | null>(null)
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cropperRef = useRef<CropperRef>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files && files.length > 0) {
      setFile(files[0])
      const url = URL.createObjectURL(files[0])
      setPreviewURL(url)
      console.log(files[0])
    }
  }

  function pickFile() {
    fileInputRef.current?.click()
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submitFile() {
    setIsSubmitting(true)
    if (!file) return
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas()
      if (canvas) {
        canvas.toBlob(async (blob) => {
          if (!blob) return
          console.log("Cropped blob:", blob)
          const dataUrl = canvas.toDataURL("image/png")
          console.log("Cropped data URL:", dataUrl)
          const formData = new FormData()
          formData.append("image", blob, file.name)
          for (const [key, value] of formData.entries()) {
            console.log("FormData entry:", key, value)
          }
          try {
            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            })
            const data = await response.json()
            console.log(data)
            setIsSubmitting(false)
          } catch (error) {
            console.error(error)
          }
        }, "image/png")
        return
      }
    }
    const formData = new FormData()
    formData.append("image", file)
    console.log("Fallback file:", file)
    for (const [key, value] of formData.entries()) {
      console.log("FormData entry:", key, value)
    }
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      console.log(data)
      setIsSubmitting(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="md:px-24 md:pt-18 p-8 flex flex-col gap-6 max-w-3xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-medium text-gray-600">
          What would you like to do?
        </h1>
      </div>
      <div className="flex flex-col gap-2">
        {previewURL ? (
          <>
            <Cropper ref={cropperRef} src={previewURL} className="rounded-lg" />
            <AnimatePresence>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-gray-600 font-medium font-ibm-plex-mono ml-1 flex items-center gap-2"
              >
                <CornerDownRight className="text-gray-600" size={16} />
                <span className="mt-0.5">
                  The cropped version will be submitted.
                </span>
              </motion.p>
            </AnimatePresence>
            <div className="flex items-center gap-2 mt-2">
              <div
                className="rounded-md border border-gray-200 font-sf-pro-rounded font-medium w-full text-sm cursor-pointer py-2"
                onClick={() => {
                  setIsSubmitting(true)
                  submitFile()
                }}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.p
                      key="submitting"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid place-items-center"
                    >
                      Submitting...
                    </motion.p>
                  ) : (
                    <motion.p
                      key="submit"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid place-items-center"
                    >
                      Submit
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <HoldConfirm
                onComplete={() => console.log("complete")}
                fillColor="#ffb3b5"
                fillColorText="#b91c1c"
                text="Hold to cancel"
                className="rounded-md border border-red-800 font-sf-pro-rounded font-medium w-fit py-2"
              />
            </div>
          </>
        ) : (
          <div
            className="flex flex-col gap-2 border border-dashed md:w-fit w-full border-gray-200 rounded-xl px-8 py-12 cursor-pointer text-center"
            onClick={pickFile}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <p className="font-sf-pro-rounded text-gray-600 font-medium md:text-md text-[17px]">
              Drag an image or click to upload
            </p>
            <div className="flex items-center gap-2 md:text-sm text-md text-center justify-center font-medium">
              <LightningIcon className="text-blue-600" size={13} />
              <p className="mr-5 font-sf-pro-rounded text-blue-700/80">
                powered by o3
              </p>
            </div>
          </div>
        )}
      </div>
      <div
        className={`flex flex-col md:gap-2 gap-3 ${previewURL ? "" : "mt-3"}`}
      >
        <button
          className="rounded-xl md:text-md text-lg w-fit text-gray-800 font-sf-pro-rounded px-0.5 font-medium cursor-pointer hover:opacity-60 hover:scale-[102%] transition-all duration-200 flex items-center gap-2"
          onClick={handleSwitchToUser}
        >
          <User className="text-gray-800" size={14} strokeWidth={2.5} />
          Switch to User
        </button>
        <button
          className="rounded-xl md:text-md text-lg w-fit text-gray-800 font-sf-pro-rounded px-0.5 font-medium cursor-pointer hover:opacity-60 hover:scale-[102%] transition-all duration-200 flex items-center gap-2"
          onClick={handleManageRota}
        >
          <Calendar className="text-gray-800" size={14} strokeWidth={2.5} />
          Manage Rota
        </button>
        <button
          className="rounded-xl md:text-md text-lg w-fit text-red-800 font-sf-pro-rounded px-0.5 font-medium cursor-pointer hover:opacity-60 hover:scale-[102%] transition-all duration-200 flex items-center gap-2"
          onClick={async () => {
            await authClient.signOut()
          }}
        >
          <LogOut className="text-red-800" size={13.5} strokeWidth={2.5} />
          Sign Out
        </button>
      </div>
    </main>
  )
}
