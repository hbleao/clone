"use client";

import { Logo } from "@/components/Logo";
import { Settings, ChevronDown, Users, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import s from "./styles.module.scss";
import Image from "next/image";

interface HeaderProps {
	children?: React.ReactNode;
}

export const Header = ({ children }: HeaderProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// TODO: Substituir por chamada real à API
	const userRole = "ADMIN"; // Simular role do usuário

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<header className={s.header}>
			<Image
				src="/assets/img/logo_porto.webp"
				alt="Logo"
				width={1000}
				height={1000}
				onClick={() => (window.location.href = "/meus-aplicativos")}
			/>
			{children}

			{userRole === "ADMIN" && (
				<div className={s.settingsMenu} ref={menuRef}>
					<button
						className={`${s.settingsButton} ${isMenuOpen ? s.active : ""}`}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<Settings size={20} />
						<span>Configurações</span>
						<ChevronDown size={16} className={isMenuOpen ? s.rotate : ""} />
					</button>

					{isMenuOpen && (
						<div className={s.dropdownMenu}>
							<a href="/usuarios" className={s.menuItem}>
								<Users size={16} />
								<span>Usuários</span>
							</a>
							<a href="/permissoes" className={s.menuItem}>
								<Shield size={16} />
								<span>Permissões</span>
							</a>
						</div>
					)}
				</div>
			)}
		</header>
	);
};
