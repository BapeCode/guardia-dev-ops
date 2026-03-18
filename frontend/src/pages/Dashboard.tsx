import Section from "@/components/Section.tsx";
import NavigationDashboard from "@/components/Navigation.tsx";

export default function Dashboard() {
    return (
        <>
            <NavigationDashboard/>

            <Section className="flex flex-col items-center">
                <p>Dashboard</p>
            </Section>
        </>
    )
}