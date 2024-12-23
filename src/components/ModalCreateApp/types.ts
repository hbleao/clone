export type ModalCreateAppProps = {
	setIsModalOpen: (value: boolean) => void;
	formData: {
		name: string;
		description: string;
		owner: string;
		userId: string;
	};
	setFormData: React.Dispatch<
		React.SetStateAction<{
			name: string;
			description: string;
			owner: string;
			userId: string;
		}>
	>;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	isLoading: boolean;
};
