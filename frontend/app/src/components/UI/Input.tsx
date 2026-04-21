export const Input = ({value, onChange, placeholder }: {
    value: string | undefined,
    onChange: (value: any) => any,
    placeholder?: string
}) => {
    return (
            <input
                value={value}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={onChange}
            />
    );
}