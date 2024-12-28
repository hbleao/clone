export function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^\w\s-]/g, "") // Remove caracteres especiais
		.replace(/\s+/g, "-") // Substitui espaços por hífens
		.replace(/-+/g, "-"); // Remove hífens duplicados
}
