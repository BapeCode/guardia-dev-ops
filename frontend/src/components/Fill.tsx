import Input from "@/components/Input.tsx";
import {useAuth} from "@/store/AuthContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FileImage} from "lucide-react";

export default function Fill() {
    const { user } = useAuth()


    return (
        <section className="flex flex-col items-center justify-start py-6 border-x border-border w-full bg-glass h-full overflow-auto">

            <div className="flex items-start justify-between gap-4 w-full px-2 border-b border-border py-4">
                <div className="rounded-full flex items-center justify-center h-12 w-12 border border-border">
                    <p className="font-bold text-xl">{user?.name.charAt(0)}</p>
                </div>

                <div className="flex flex-col items-end justify-center w-full gap-4">
                    <Input placeholder={"Quoi de neuf ?"} className="w-full shadow-none pb-6 border-b border-border outline-none focus:outline-none focus:ring-0 focus:ring-offset-0" />
                    <div className="flex items-center justify-between w-full">
                        <FileImage className="h-5 w-5 text-primary hover:text-text-1 transition-all duration-300 cursor-pointer"/>
                        <Button className="rounded-sm px-6 py-4 text-sm bg-text-1 text-card hover:bg-primary/50 transition-all duration-300 cursor-pointer">
                            Publier
                        </Button>
                    </div>
                </div>
            </div>

        </section>
    )
}