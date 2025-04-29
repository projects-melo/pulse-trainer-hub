
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container py-8 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
                <span className="font-bold text-white">FP</span>
              </div>
              <span className="text-xl font-bold">FitPulse</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Conectando personal trainers e alunos para alcançar resultados excepcionais.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link></li>
              <li><Link to="/sobre" className="text-sm text-muted-foreground hover:text-foreground">Sobre nós</Link></li>
              <li><Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">Login</Link></li>
              <li><Link to="/cadastro" className="text-sm text-muted-foreground hover:text-foreground">Cadastre-se</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <p className="text-sm text-muted-foreground mb-2">contato@fitpulse.com.br</p>
            <p className="text-sm text-muted-foreground">(11) 99999-9999</p>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FitPulse. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link to="/termos" className="text-xs text-muted-foreground hover:text-foreground">
              Termos de Serviço
            </Link>
            <Link to="/privacidade" className="text-xs text-muted-foreground hover:text-foreground">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
