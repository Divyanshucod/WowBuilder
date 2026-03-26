

export const Button = ({children, onClick, type, disabled,className}:{children: React.ReactNode, onClick: () => void, type: "primary" | "secondary", disabled: boolean, className?: string})=>{
        return <button onClick={onClick} disabled={disabled} className={`py-2 px-4 rounded ${type === "primary" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"} ${className}`}>{children}</button>
}