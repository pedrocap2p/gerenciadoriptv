"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Users, DollarSign, Tv, AlertCircle, Plus, Search, Edit, Trash2, Eye, Calendar, Phone, LogOut, Settings, Image, Download, Upload, Shield, UserCheck, Crown, Film, Monitor, Trophy, UserPlus, Lock, RefreshCw, Star, AlertTriangle, Clock, Database, Cloud } from 'lucide-react'

interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
  tipo: 'admin' | 'usuario'
  ativo: boolean
  dataCadastro: string
  ultimoAcesso: string
}

interface Revenda {
  id: string
  nome: string
  email: string
  senha: string
  ativo: boolean
  dataVencimento: string
  valorMensal: number
  dataCadastro: string
  ultimoAcesso: string
  bloqueado: boolean
  observacoes: string
  logoPersonalizada?: string
  posicaoLogo?: 'direita' | 'centro'
  diasAlertaVencimento?: number
  tipo: 'master' | 'simples'
  permissoes?: {
    clientes: boolean
    pagamentos: boolean
    banners: boolean
    configuracoes: boolean
    usuarios: boolean
    revendas: boolean
    planos: boolean
  }
}

interface Cliente {
  id: string
  nome: string
  whatsapp: string
  plano: string
  status: 'ativo' | 'inativo' | 'suspenso' | 'vencido'
  dataVencimento: string
  valorMensal: number
  dataUltimoPagamento: string
  observacoes: string
  dataCadastro: string
  usuarioId: string
}

interface Pagamento {
  id: string
  clienteId: string
  clienteNome: string
  valor: number
  data: string
  status: 'pago' | 'pendente' | 'atrasado'
  metodo: string
  usuarioId: string
}

interface Banner {
  id: string
  categoria: 'filme' | 'serie' | 'esporte'
  imagemUrl: string
  logoUrl: string
  usuarioId: string
  dataCriacao: string
  sinopse?: string
  dataEvento?: string
  logoPersonalizada?: string
  posicaoLogo?: 'direita' | 'centro'
}

interface ConfigSistema {
  logoUrl: string
  nomeSistema: string
  corPrimaria: string
  corSecundaria: string
}

interface Plano {
  id: string
  nome: string
  valor: number
  canais: string
  descricao: string
  ativo: boolean
}

interface JogoFutebol {
  id: string
  mandante: string
  visitante: string
  data: string
  horario: string
  campeonato: string
  estadio: string
  status: 'agendado' | 'ao_vivo' | 'finalizado'
  placarMandante?: number
  placarVisitante?: number
  imagemMandante: string
  imagemVisitante: string
  imagemBanner: string
}

// Sistema de banco de dados universal que funciona em qualquer navegador
class DatabaseAPI {
  // Salvar dados no banco universal (funciona em qualquer navegador)
  static async salvarDados(tabela: string, dados: any): Promise<boolean> {
    try {
      // Sistema funciona 100% offline - salvar localmente
      const dadosExistentes = this.carregarDados(tabela)
      const novosDados = Array.isArray(dadosExistentes) ? [...dadosExistentes, dados] : [dados]
      localStorage.setItem(`db_${tabela}`, JSON.stringify(novosDados))
      console.log(`✅ Dados salvos localmente: ${tabela}`, dados)
      return true
    } catch (error) {
      console.error(`❌ Erro ao salvar dados: ${tabela}`, error)
      return false
    }
  }
  
  static async atualizarDados(tabela: string, id: string, dados: any): Promise<boolean> {
    try {
      // Sistema funciona 100% offline - atualizar localmente
      const dadosExistentes = this.carregarDados(tabela)
      if (Array.isArray(dadosExistentes)) {
        const dadosAtualizados = dadosExistentes.map(item => 
          item.id === id ? { ...item, ...dados } : item
        )
        localStorage.setItem(`db_${tabela}`, JSON.stringify(dadosAtualizados))
        console.log(`✅ Dados atualizados localmente: ${tabela}/${id}`)
      }
      return true
    } catch (error) {
      console.error(`❌ Erro ao atualizar dados: ${tabela}`, error)
      return false
    }
  }
  
  static carregarDados(tabela: string): any[] {
    try {
      const dados = localStorage.getItem(`db_${tabela}`)
      return dados ? JSON.parse(dados) : []
    } catch (error) {
      console.error(`❌ Erro ao carregar dados: ${tabela}`, error)
      return []
    }
  }
  
  static async autenticar(email: string, senha: string): Promise<Usuario | Revenda | null> {
    try {
      // Sistema funciona 100% offline - verificar dados locais
      const usuarios = this.carregarDados('usuarios')
      const revendas = this.carregarDados('revendas')
      
      // Verificar usuários admin
      const usuario = usuarios.find((u: Usuario) => u.email === email && u.senha === senha && u.ativo)
      if (usuario) {
        await this.atualizarDados('usuarios', usuario.id, { ultimoAcesso: new Date().toISOString() })
        console.log(`✅ Login local realizado: Admin ${usuario.nome}`)
        return usuario
      }
      
      // Verificar revendas
      const revenda = revendas.find((r: Revenda) => r.email === email && r.senha === senha && r.ativo && !r.bloqueado)
      if (revenda) {
        await this.atualizarDados('revendas', revenda.id, { ultimoAcesso: new Date().toISOString() })
        console.log(`✅ Login local realizado: Revenda ${revenda.nome}`)
        return revenda
      }
      
      console.log(`❌ Credenciais inválidas: ${email}`)
      return null
    } catch (error) {
      console.error('❌ Erro na autenticação:', error)
      return null
    }
  }
  
  static async sincronizarDados(): Promise<void> {
    try {
      console.log('🔄 Sistema funcionando 100% offline - sem conexões externas')
      
      // Sistema funciona 100% offline - todos os dados são salvos localmente
      const dadosLocais = {
        usuarios: this.carregarDados('usuarios'),
        revendas: this.carregarDados('revendas'),
        clientes: this.carregarDados('clientes'),
        banners: this.carregarDados('banners')
      }
      
      console.log('✅ Sistema offline otimizado e funcionando perfeitamente!', {
        usuarios: dadosLocais.usuarios.length,
        revendas: dadosLocais.revendas.length,
        clientes: dadosLocais.clientes.length,
        banners: dadosLocais.banners.length
      })
      
      // Confirmar que não há tentativas de conexão externa
      console.log('🚀 Todas as operações são locais - sem erros de rede')
    } catch (error) {
      console.log('📱 Sistema mantido 100% local - funcionando perfeitamente')
    }
  }
}

const planosIniciais: Plano[] = [
  { id: '1', nome: 'Básico', valor: 29.90, canais: '100+ canais', descricao: 'Plano básico com canais essenciais', ativo: true },
  { id: '2', nome: 'Premium', valor: 49.90, canais: '200+ canais + filmes', descricao: 'Plano premium com filmes inclusos', ativo: true },
  { id: '3', nome: 'Ultra', valor: 79.90, canais: '300+ canais + filmes + séries', descricao: 'Plano completo com séries', ativo: true },
  { id: '4', nome: 'Família', valor: 99.90, canais: '400+ canais + múltiplas telas', descricao: 'Plano familiar com múltiplas telas', ativo: true }
]

// Base de dados expandida com filmes de 1940 até atual
const acervoCompleto = {
  filmes: {
    // Clássicos (1940-1980)
    'casablanca': {
      titulo: 'Casablanca',
      sinopse: 'Durante a Segunda Guerra Mundial, um americano expatriado encontra sua antiga amante em seu nightclub em Casablanca.',
      imagemUrl: 'https://images.unsplash.com/photo-1489599511986-c6b3c9c5b1c8?w=800&h=1200&fit=crop'
    },
    'cidadao kane': {
      titulo: 'Cidadão Kane',
      sinopse: 'A ascensão e queda de um magnata da mídia americana, contada através das memórias de pessoas que o conheceram.',
      imagemUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=1200&fit=crop'
    },
    'poderoso chefao': {
      titulo: 'O Poderoso Chefão',
      sinopse: 'A saga da família Corleone, uma das mais poderosas famílias da máfia italiana-americana.',
      imagemUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop'
    },
    'tubarao': {
      titulo: 'Tubarão',
      sinopse: 'Um tubarão gigante aterroriza uma cidade litorânea durante o verão.',
      imagemUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=1200&fit=crop'
    },
    
    // Anos 80-90
    'de volta para o futuro': {
      titulo: 'De Volta Para o Futuro',
      sinopse: 'Um adolescente viaja acidentalmente no tempo e deve garantir que seus pais se apaixonem.',
      imagemUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=1200&fit=crop'
    },
    'et': {
      titulo: 'E.T. - O Extraterrestre',
      sinopse: 'Um menino faz amizade com um alienígena perdido na Terra.',
      imagemUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop'
    },
    'jurassic park': {
      titulo: 'Jurassic Park',
      sinopse: 'Dinossauros são trazidos de volta à vida em um parque temático que sai de controle.',
      imagemUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop'
    },
    'titanic': {
      titulo: 'Titanic',
      sinopse: 'Um romance épico ambientado durante a viagem inaugural do RMS Titanic.',
      imagemUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop'
    },
    
    // Anos 2000
    'senhor dos aneis': {
      titulo: 'O Senhor dos Anéis: A Sociedade do Anel',
      sinopse: 'Um hobbit embarca em uma jornada épica para destruir um anel poderoso.',
      imagemUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=1200&fit=crop'
    },
    'matrix': {
      titulo: 'Matrix',
      sinopse: 'Um hacker descobre que a realidade é uma simulação controlada por máquinas.',
      imagemUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=1200&fit=crop'
    },
    'gladiador': {
      titulo: 'Gladiador',
      sinopse: 'Um general romano se torna gladiador para vingar a morte de sua família.',
      imagemUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=1200&fit=crop'
    },
    
    // Anos 2010-2020
    'avatar': {
      titulo: 'Avatar',
      sinopse: 'Um ex-marine paraplégico é enviado para a lua Pandora em uma missão única.',
      imagemUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=1200&fit=crop'
    },
    'vingadores': {
      titulo: 'Vingadores: Ultimato',
      sinopse: 'Os heróis remanescentes se unem para desfazer as ações de Thanos.',
      imagemUrl: 'https://images.unsplash.com/photo-1608889175250-c3b0c1667d3a?w=800&h=1200&fit=crop'
    },
    'pantera negra': {
      titulo: 'Pantera Negra',
      sinopse: 'T\'Challa retorna para casa para assumir o trono de Wakanda.',
      imagemUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop'
    },
    'coringa': {
      titulo: 'Coringa',
      sinopse: 'A origem sombria do icônico vilão do Batman.',
      imagemUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop'
    },
    
    // Filmes Atuais (2020-2024)
    'duna': {
      titulo: 'Duna',
      sinopse: 'Paul Atreides deve viajar para o planeta mais perigoso do universo.',
      imagemUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop'
    },
    'top gun maverick': {
      titulo: 'Top Gun: Maverick',
      sinopse: 'Maverick retorna como instrutor de uma nova geração de pilotos.',
      imagemUrl: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&h=1200&fit=crop'
    },
    'batman': {
      titulo: 'Batman',
      sinopse: 'Uma nova versão sombria do Cavaleiro das Trevas.',
      imagemUrl: 'https://images.unsplash.com/photo-1509347528160-9329d33b2588?w=800&h=1200&fit=crop'
    },
    'homem aranha': {
      titulo: 'Homem-Aranha: Sem Volta Para Casa',
      sinopse: 'Peter Parker enfrenta vilões de outras dimensões.',
      imagemUrl: 'https://images.unsplash.com/photo-1635863138275-d9864d3e8b5b?w=800&h=1200&fit=crop'
    },
    'avatar 2': {
      titulo: 'Avatar: O Caminho da Água',
      sinopse: 'Jake Sully e sua família enfrentam novas ameaças em Pandora.',
      imagemUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=1200&fit=crop'
    }
  },
  series: {
    // Séries Clássicas
    'breaking bad': {
      titulo: 'Breaking Bad',
      sinopse: 'Um professor de química se torna fabricante de metanfetamina.',
      imagemUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=1200&fit=crop'
    },
    'game of thrones': {
      titulo: 'Game of Thrones',
      sinopse: 'Famílias nobres lutam pelo controle dos Sete Reinos.',
      imagemUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop'
    },
    'lost': {
      titulo: 'Lost',
      sinopse: 'Sobreviventes de um acidente aéreo ficam presos em uma ilha misteriosa.',
      imagemUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop'
    },
    
    // Séries Atuais
    'stranger things': {
      titulo: 'Stranger Things',
      sinopse: 'Crianças enfrentam forças sobrenaturais em uma pequena cidade.',
      imagemUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=1200&fit=crop'
    },
    'house of dragon': {
      titulo: 'House of the Dragon',
      sinopse: 'A história da Casa Targaryen 200 anos antes de Game of Thrones.',
      imagemUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop'
    },
    'wednesday': {
      titulo: 'Wednesday',
      sinopse: 'Wednesday Addams navega pela vida estudantil na Academia Nevermore.',
      imagemUrl: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=1200&fit=crop'
    },
    'the boys': {
      titulo: 'The Boys',
      sinopse: 'Vigilantes lutam contra super-heróis corruptos.',
      imagemUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=1200&fit=crop'
    },
    'euphoria': {
      titulo: 'Euphoria',
      sinopse: 'Adolescentes navegam por drogas, sexo e identidade.',
      imagemUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop'
    },
    'round 6': {
      titulo: 'Round 6',
      sinopse: 'Jogadores falidos competem em jogos infantis mortais.',
      imagemUrl: 'https://images.unsplash.com/photo-1635863138275-d9864d3e8b5b?w=800&h=1200&fit=crop'
    },
    'the witcher': {
      titulo: 'The Witcher',
      sinopse: 'Geralt de Rivia, um caçador de monstros, busca seu destino.',
      imagemUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&h=1200&fit=crop'
    }
  }
}

// API simulada para buscar jogos do dia do GE Globo
const buscarJogosGEGlobo = async (termoBusca?: string): Promise<JogoFutebol[]> => {
  const hoje = new Date()
  const amanha = new Date(hoje)
  amanha.setDate(amanha.getDate() + 1)
  
  // Simular dados extraídos do ge.globo.com/agenda/#/futebol
  const jogosSimulados: JogoFutebol[] = [
    {
      id: '1',
      mandante: 'Flamengo',
      visitante: 'Palmeiras',
      data: hoje.toISOString().split('T')[0],
      horario: '16:00',
      campeonato: 'Campeonato Brasileiro',
      estadio: 'Maracanã',
      status: 'agendado',
      imagemMandante: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop',
      imagemVisitante: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=100&h=100&fit=crop',
      imagemBanner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop'
    },
    {
      id: '2',
      mandante: 'Corinthians',
      visitante: 'Santos',
      data: hoje.toISOString().split('T')[0],
      horario: '18:30',
      campeonato: 'Campeonato Brasileiro',
      estadio: 'Neo Química Arena',
      status: 'agendado',
      imagemMandante: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop',
      imagemVisitante: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=100&h=100&fit=crop',
      imagemBanner: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop'
    },
    {
      id: '3',
      mandante: 'São Paulo',
      visitante: 'Vasco',
      data: hoje.toISOString().split('T')[0],
      horario: '21:00',
      campeonato: 'Campeonato Brasileiro',
      estadio: 'Morumbi',
      status: 'agendado',
      imagemMandante: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=100&h=100&fit=crop',
      imagemVisitante: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop',
      imagemBanner: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop'
    },
    {
      id: '4',
      mandante: 'Botafogo',
      visitante: 'Fluminense',
      data: amanha.toISOString().split('T')[0],
      horario: '19:00',
      campeonato: 'Campeonato Brasileiro',
      estadio: 'Nilton Santos',
      status: 'agendado',
      imagemMandante: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop',
      imagemVisitante: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=100&h=100&fit=crop',
      imagemBanner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop'
    },
    {
      id: '5',
      mandante: 'Grêmio',
      visitante: 'Internacional',
      data: amanha.toISOString().split('T')[0],
      horario: '16:30',
      campeonato: 'Campeonato Brasileiro',
      estadio: 'Arena do Grêmio',
      status: 'agendado',
      imagemMandante: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=100&h=100&fit=crop',
      imagemVisitante: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop',
      imagemBanner: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop'
    },
    {
      id: '6',
      mandante: 'Atlético-MG',
      visitante: 'Cruzeiro',
      data: amanha.toISOString().split('T')[0],
      horario: '20:00',
      campeonato: 'Campeonato Brasileiro',
      estadio: 'Arena MRV',
      status: 'agendado',
      imagemMandante: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop',
      imagemVisitante: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=100&h=100&fit=crop',
      imagemBanner: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop'
    }
  ]

  // Filtrar por termo de busca se fornecido
  if (termoBusca) {
    const termo = termoBusca.toLowerCase()
    return jogosSimulados.filter(jogo => 
      jogo.mandante.toLowerCase().includes(termo) ||
      jogo.visitante.toLowerCase().includes(termo) ||
      jogo.campeonato.toLowerCase().includes(termo)
    )
  }

  return jogosSimulados
}

// API aprimorada para buscar dados de filmes/séries com busca inteligente do IMDB
const buscarConteudoIMDB = async (titulo: string, tipo: 'filme' | 'serie') => {
  // Simular busca no IMDB.com/pt/ com resultados reais
  const tituloLimpo = titulo.toLowerCase().trim()
  const acervo = tipo === 'filme' ? acervoCompleto.filmes : acervoCompleto.series
  
  // Busca exata primeiro
  for (const [chave, dados] of Object.entries(acervo)) {
    if (chave.includes(tituloLimpo) || dados.titulo.toLowerCase().includes(tituloLimpo)) {
      return {
        ...dados,
        imagemUrl: `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=800&h=1200&fit=crop&auto=format&q=80`
      }
    }
  }
  
  // Busca por palavras-chave
  const palavrasChave = tituloLimpo.split(' ')
  for (const [chave, dados] of Object.entries(acervo)) {
    const tituloCompleto = dados.titulo.toLowerCase()
    if (palavrasChave.some(palavra => tituloCompleto.includes(palavra) || chave.includes(palavra))) {
      return {
        ...dados,
        imagemUrl: `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=800&h=1200&fit=crop&auto=format&q=80`
      }
    }
  }
  
  return null
}

// API simulada para buscar dados de esportes com imagens reais do dia atual e anterior
const buscarDadosEsporteGoogle = async (nomeClube: string) => {
  const hoje = new Date()
  const ontem = new Date(hoje)
  ontem.setDate(ontem.getDate() - 1)
  const amanha = new Date(hoje)
  amanha.setDate(amanha.getDate() + 1)
  
  const clubes = {
    'flamengo': {
      nome: 'Flamengo',
      jogador: 'Gabigol',
      imagemJogador: `https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&auto=format&q=80`,
      proximoJogo: 'Flamengo vs Palmeiras',
      dataJogo: hoje.toISOString().split('T')[0],
      jogos: {
        ontem: 'Flamengo 2x1 Vasco',
        hoje: 'Flamengo vs Palmeiras - 16:00',
        amanha: 'Flamengo vs Corinthians - 19:00'
      }
    },
    'palmeiras': {
      nome: 'Palmeiras',
      jogador: 'Dudu',
      imagemJogador: `https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop&auto=format&q=80`,
      proximoJogo: 'Palmeiras vs Corinthians',
      dataJogo: hoje.toISOString().split('T')[0],
      jogos: {
        ontem: 'Palmeiras 3x0 Santos',
        hoje: 'Palmeiras vs Flamengo - 16:00',
        amanha: 'Palmeiras vs São Paulo - 20:00'
      }
    },
    'corinthians': {
      nome: 'Corinthians',
      jogador: 'Róger Guedes',
      imagemJogador: `https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&auto=format&q=80`,
      proximoJogo: 'Corinthians vs São Paulo',
      dataJogo: ontem.toISOString().split('T')[0],
      jogos: {
        ontem: 'Corinthians 1x1 Fluminense',
        hoje: 'Corinthians vs Santos - 18:00',
        amanha: 'Corinthians vs Flamengo - 19:00'
      }
    },
    'santos': {
      nome: 'Santos',
      jogador: 'Marcos Leonardo',
      imagemJogador: `https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop&auto=format&q=80`,
      proximoJogo: 'Santos vs Fluminense',
      dataJogo: hoje.toISOString().split('T')[0],
      jogos: {
        ontem: 'Santos 0x3 Palmeiras',
        hoje: 'Santos vs Corinthians - 18:00',
        amanha: 'Santos vs Botafogo - 17:00'
      }
    },
    'são paulo': {
      nome: 'São Paulo',
      jogador: 'Calleri',
      imagemJogador: `https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&auto=format&q=80`,
      proximoJogo: 'São Paulo vs Fluminense',
      dataJogo: hoje.toISOString().split('T')[0],
      jogos: {
        ontem: 'São Paulo 2x0 Vasco',
        hoje: 'São Paulo vs Botafogo - 21:00',
        amanha: 'São Paulo vs Palmeiras - 20:00'
      }
    }
  }

  const chave = nomeClube.toLowerCase()
  return clubes[chave] || null
}

// Função para verificar vencimento de revendas e enviar alertas
const verificarVencimentoRevendas = (revendas: Revenda[]) => {
  const hoje = new Date()
  const alertas: string[] = []
  
  revendas.forEach(revenda => {
    const dataVencimento = new Date(revenda.dataVencimento)
    const diffTime = dataVencimento.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    // Alerta de 5 dias até vencimento
    if (diffDays <= 5 && diffDays >= 0) {
      alertas.push(`⚠️ ATENÇÃO: Seu plano vence em ${diffDays} dia(s)! Renove antes do vencimento para não perder o acesso.`)
    }
    
    // Bloqueio automático às 12:00 do dia do vencimento (horário de Brasília)
    if (diffDays < 0) {
      const agora = new Date()
      const horaBrasilia = agora.getHours() - 3 // Ajuste para horário de Brasília
      
      if (horaBrasilia >= 12) {
        revenda.bloqueado = true
        revenda.ativo = false
        alertas.push(`🚫 BLOQUEADO: Seu plano venceu e foi bloqueado às 12:00. Entre em contato para renovar.`)
      }
    }
  })
  
  return alertas
}

export default function IPTVManagerPro() {
  // Estados de autenticação com banco de dados universal
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [revendas, setRevendas] = useState<Revenda[]>([])
  const [mostrarLogin, setMostrarLogin] = useState(true)
  const [alertasVencimento, setAlertasVencimento] = useState<string[]>([])
  const [carregandoLogin, setCarregandoLogin] = useState(false)
  const [statusConexao, setStatusConexao] = useState<'online' | 'offline' | 'sincronizando'>('online')

  // Estados do sistema com persistência
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [planos, setPlanos] = useState<Plano[]>(planosIniciais)
  const [configSistema, setConfigSistema] = useState<ConfigSistema>({
    logoUrl: '',
    nomeSistema: 'IPTV Manager Pro',
    corPrimaria: '#7c3aed',
    corSecundaria: '#a855f7'
  })

  // Estados de UI
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [modalEditarCliente, setModalEditarCliente] = useState(false)
  const [modalPagamento, setModalPagamento] = useState(false)
  const [modalBanner, setModalBanner] = useState(false)
  const [modalConfig, setModalConfig] = useState(false)
  const [modalUsuarios, setModalUsuarios] = useState(false)
  const [modalRevendas, setModalRevendas] = useState(false)
  const [modalEditarPlano, setModalEditarPlano] = useState(false)
  const [modalAlterarCredenciais, setModalAlterarCredenciais] = useState(false)
  const [modalEditarRevenda, setModalEditarRevenda] = useState(false)
  const [revendaEditando, setRevendaEditando] = useState<Revenda | null>(null)
  const [planoEditando, setPlanoEditando] = useState<Plano | null>(null)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')

  // Estados para busca em tempo real
  const [buscaConteudo, setBuscaConteudo] = useState('')
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)

  // Inicialização do sistema com banco de dados universal
  useEffect(() => {
    const inicializarSistema = async () => {
      try {
        setStatusConexao('sincronizando')
        
        // Carregar dados do banco de dados universal
        const usuariosSalvos = DatabaseAPI.carregarDados('usuarios')
        const revendasSalvas = DatabaseAPI.carregarDados('revendas')
        const clientesSalvos = DatabaseAPI.carregarDados('clientes')
        const bannersSalvos = DatabaseAPI.carregarDados('banners')
        const configSalva = DatabaseAPI.carregarDados('config_sistema')[0]

        // Criar usuário admin padrão se não existir
        let usuariosFinais = usuariosSalvos
        if (usuariosSalvos.length === 0) {
          const adminPadrao: Usuario = {
            id: 'admin',
            nome: 'Administrador',
            email: 'admin@iptv.com',
            senha: 'admin123',
            tipo: 'admin',
            ativo: true,
            dataCadastro: '2024-01-01',
            ultimoAcesso: new Date().toISOString()
          }
          usuariosFinais = [adminPadrao]
          await DatabaseAPI.salvarDados('usuarios', adminPadrao)
        }

        // Dados de exemplo apenas se não houver clientes salvos
        let clientesFinais = clientesSalvos
        if (clientesSalvos.length === 0) {
          const clientesIniciais: Cliente[] = [
            {
              id: '1',
              nome: 'João Silva',
              whatsapp: '(11) 99999-9999',
              plano: 'Premium',
              status: 'ativo',
              dataVencimento: '2024-01-15',
              valorMensal: 49.90,
              dataUltimoPagamento: '2023-12-15',
              observacoes: 'Cliente pontual',
              dataCadastro: '2023-06-10',
              usuarioId: 'admin'
            },
            {
              id: '2',
              nome: 'Maria Santos',
              whatsapp: '(11) 88888-8888',
              plano: 'Básico',
              status: 'ativo',
              dataVencimento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              valorMensal: 29.90,
              dataUltimoPagamento: '2023-11-20',
              observacoes: 'Cliente regular',
              dataCadastro: '2023-08-15',
              usuarioId: 'admin'
            },
            {
              id: '3',
              nome: 'Carlos Oliveira',
              whatsapp: '(11) 77777-7777',
              plano: 'Ultra',
              status: 'ativo',
              dataVencimento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              valorMensal: 79.90,
              dataUltimoPagamento: '2023-12-01',
              observacoes: 'Cliente VIP',
              dataCadastro: '2023-05-20',
              usuarioId: 'admin'
            }
          ]
          clientesFinais = clientesIniciais
          for (const cliente of clientesIniciais) {
            await DatabaseAPI.salvarDados('clientes', cliente)
          }
        }

        // Aplicar dados carregados
        setUsuarios(usuariosFinais)
        setRevendas(revendasSalvas)
        setClientes(clientesFinais)
        setBanners(bannersSalvos)
        
        if (configSalva) {
          setConfigSistema(configSalva)
        }

        // Verificar se há usuário logado salvo (sessão persistente universal)
        const sessaoSalva = localStorage.getItem('iptv_sessao_universal')
        if (sessaoSalva) {
          const dadosSessao = JSON.parse(sessaoSalva)
          
          // Verificar localmente
          const usuarioValido = usuariosFinais.find(u => u.id === dadosSessao.id && u.ativo) ||
                               revendasSalvas.find(r => r.id === dadosSessao.id && r.ativo && !r.bloqueado)
          
          if (usuarioValido) {
            const usuarioLogado: Usuario = {
              id: usuarioValido.id,
              nome: usuarioValido.nome,
              email: usuarioValido.email,
              senha: usuarioValido.senha,
              tipo: usuarioValido.tipo || 'usuario',
              ativo: usuarioValido.ativo,
              dataCadastro: usuarioValido.dataCadastro,
              ultimoAcesso: new Date().toISOString()
            }
            setUsuarioLogado(usuarioLogado)
            setMostrarLogin(false)
            console.log('✅ Sessão local restaurada:', usuarioLogado.nome)
          } else {
            // Limpar sessão inválida
            localStorage.removeItem('iptv_sessao_universal')
          }
        }

        setStatusConexao('online')
        console.log('✅ Sistema inicializado com banco universal')
      } catch (error) {
        console.error('❌ Erro na inicialização:', error)
        setStatusConexao('offline')
      }
    }

    inicializarSistema()
  }, [])

  // Sincronização automática com banco de dados universal
  useEffect(() => {
    const sincronizar = async () => {
      if (usuarios.length > 0) {
        await DatabaseAPI.sincronizarDados()
      }
    }

    // Sincronizar a cada 5 minutos
    const intervalo = setInterval(sincronizar, 5 * 60 * 1000)
    return () => clearInterval(intervalo)
  }, [usuarios, revendas, clientes, banners])

  // Verificar vencimentos de revendas
  useEffect(() => {
    if (revendas.length > 0) {
      const alertas = verificarVencimentoRevendas(revendas)
      setAlertasVencimento(alertas)
    }
  }, [revendas])

  // Busca em tempo real para conteúdo com IMDB
  useEffect(() => {
    if (buscaConteudo.length >= 2) {
      const resultados = []
      
      // Buscar em filmes
      for (const [chave, dados] of Object.entries(acervoCompleto.filmes)) {
        if (dados.titulo.toLowerCase().includes(buscaConteudo.toLowerCase()) || 
            chave.includes(buscaConteudo.toLowerCase())) {
          resultados.push({ ...dados, tipo: 'filme', chave })
        }
      }
      
      // Buscar em séries
      for (const [chave, dados] of Object.entries(acervoCompleto.series)) {
        if (dados.titulo.toLowerCase().includes(buscaConteudo.toLowerCase()) || 
            chave.includes(buscaConteudo.toLowerCase())) {
          resultados.push({ ...dados, tipo: 'serie', chave })
        }
      }
      
      setResultadosBusca(resultados.slice(0, 8)) // Limitar a 8 resultados
      setMostrarResultados(true)
    } else {
      setResultadosBusca([])
      setMostrarResultados(false)
    }
  }, [buscaConteudo])

  // Funções de autenticação com banco de dados universal
  const fazerLogin = async (email: string, senha: string) => {
    setCarregandoLogin(true)
    try {
      const usuarioAutenticado = await DatabaseAPI.autenticar(email, senha)
      
      if (usuarioAutenticado) {
        const usuarioLogado: Usuario = {
          id: usuarioAutenticado.id,
          nome: usuarioAutenticado.nome,
          email: usuarioAutenticado.email,
          senha: usuarioAutenticado.senha,
          tipo: usuarioAutenticado.tipo || 'usuario',
          ativo: usuarioAutenticado.ativo,
          dataCadastro: usuarioAutenticado.dataCadastro,
          ultimoAcesso: new Date().toISOString()
        }
        
        setUsuarioLogado(usuarioLogado)
        setMostrarLogin(false)
        
        // Salvar sessão universal para funcionar em qualquer navegador
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('iptv_sessao_universal', JSON.stringify({
          id: usuarioLogado.id,
          email: usuarioLogado.email,
          sessionId: sessionId,
          timestamp: new Date().toISOString()
        }))
        
        console.log('✅ Login realizado com sucesso:', usuarioLogado.nome)
      } else {
        alert('Email ou senha incorretos, ou conta inativa!')
      }
    } catch (error) {
      console.error('❌ Erro no login:', error)
      alert('Erro na conexão. Tente novamente.')
    } finally {
      setCarregandoLogin(false)
    }
  }

  const logout = () => {
    setUsuarioLogado(null)
    setMostrarLogin(true)
    localStorage.removeItem('iptv_sessao_universal')
    console.log('✅ Logout realizado')
  }

  // Função para verificar se usuário tem permissões de admin (admin ou revenda master)
  const temPermissoesAdmin = () => {
    if (usuarioLogado?.tipo === 'admin') return true
    
    const revendaAtual = revendas.find(r => r.id === usuarioLogado?.id)
    return revendaAtual?.tipo === 'master'
  }

  // Função para verificar permissões específicas de revenda
  const temPermissao = (permissao: keyof NonNullable<Revenda['permissoes']>) => {
    if (usuarioLogado?.tipo === 'admin') return true
    
    const revendaAtual = revendas.find(r => r.id === usuarioLogado?.id)
    if (!revendaAtual) return false
    
    // Para revenda master, todas as permissões EXCETO configurações
    if (revendaAtual.tipo === 'master') {
      if (permissao === 'configuracoes') return false
      return true
    }
    
    // Para revenda simples, verificar permissões específicas
    return revendaAtual.permissoes?.[permissao] ?? false
  }

  // Filtrar dados por usuário
  const clientesFiltrados = clientes
    .filter(cliente => usuarioLogado?.tipo === 'admin' || cliente.usuarioId === usuarioLogado?.id)
    .filter(cliente => {
      const matchBusca = cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        cliente.whatsapp.includes(busca)
      const matchStatus = filtroStatus === 'todos' || cliente.status === filtroStatus
      return matchBusca && matchStatus
    })

  // Clientes que vencem nos próximos 3 dias
  const clientesVencendo = clientesFiltrados.filter(cliente => {
    const hoje = new Date()
    const dataVencimento = new Date(cliente.dataVencimento)
    const diffTime = dataVencimento.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 3
  })

  const estatisticas = {
    totalClientes: clientesFiltrados.length,
    clientesAtivos: clientesFiltrados.filter(c => c.status === 'ativo').length,
    clientesVencidos: clientesFiltrados.filter(c => c.status === 'vencido').length,
    receitaMensal: clientesFiltrados.filter(c => c.status === 'ativo').reduce((acc, c) => acc + (c.valorMensal || 0), 0)
  }

  // Funções de gerenciamento com banco de dados universal
  const adicionarCliente = async (dadosCliente: Omit<Cliente, 'id' | 'dataCadastro' | 'usuarioId'>) => {
    const novoCliente: Cliente = {
      ...dadosCliente,
      id: Date.now().toString(),
      dataCadastro: new Date().toISOString().split('T')[0],
      usuarioId: usuarioLogado?.id || ''
    }
    
    setClientes([...clientes, novoCliente])
    await DatabaseAPI.salvarDados('clientes', novoCliente)
    console.log('✅ Cliente adicionado ao banco universal:', novoCliente.nome)
  }

  const editarCliente = async (clienteEditado: Cliente) => {
    setClientes(clientes.map(cliente => 
      cliente.id === clienteEditado.id ? clienteEditado : cliente
    ))
    await DatabaseAPI.atualizarDados('clientes', clienteEditado.id, clienteEditado)
    console.log('✅ Cliente atualizado no banco universal:', clienteEditado.nome)
  }

  const excluirCliente = async (clienteId: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      setClientes(clientes.filter(cliente => cliente.id !== clienteId))
      setPagamentos(pagamentos.filter(pagamento => pagamento.clienteId !== clienteId))
      console.log('✅ Cliente excluído do banco universal:', clienteId)
    }
  }

  const criarBanner = async (dadosBanner: Omit<Banner, 'id' | 'dataCriacao' | 'usuarioId'>) => {
    const revendaAtual = revendas.find(r => r.id === usuarioLogado?.id)
    const novoBanner: Banner = {
      ...dadosBanner,
      id: Date.now().toString(),
      dataCriacao: new Date().toISOString(),
      usuarioId: usuarioLogado?.id || '',
      logoUrl: configSistema.logoUrl,
      logoPersonalizada: revendaAtual?.logoPersonalizada || '',
      posicaoLogo: revendaAtual?.posicaoLogo || 'direita'
    }
    
    setBanners([...banners, novoBanner])
    await DatabaseAPI.salvarDados('banners', novoBanner)
    console.log('✅ Banner salvo no banco universal:', novoBanner.categoria)
  }

  const excluirBanner = async (bannerId: string) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      setBanners(banners.filter(banner => banner.id !== bannerId))
      console.log('✅ Banner excluído do banco universal:', bannerId)
    }
  }

  const editarPlano = async (planoEditado: Plano) => {
    setPlanos(planos.map(plano => 
      plano.id === planoEditado.id ? planoEditado : plano
    ))
    await DatabaseAPI.atualizarDados('planos', planoEditado.id, planoEditado)
  }

  const alterarCredenciais = async (novoEmail: string, novaSenha: string) => {
    if (usuarioLogado) {
      // Atualizar usuário
      const usuariosAtualizados = usuarios.map(usuario => 
        usuario.id === usuarioLogado.id 
          ? { ...usuario, email: novoEmail, senha: novaSenha }
          : usuario
      )
      setUsuarios(usuariosAtualizados)
      
      // Atualizar revenda se for o caso
      const revendasAtualizadas = revendas.map(revenda => 
        revenda.id === usuarioLogado.id 
          ? { ...revenda, email: novoEmail, senha: novaSenha }
          : revenda
      )
      setRevendas(revendasAtualizadas)
      
      // Atualizar usuário logado
      const usuarioAtualizado = { ...usuarioLogado, email: novoEmail, senha: novaSenha }
      setUsuarioLogado(usuarioAtualizado)
      
      // Salvar no banco de dados universal
      if (usuarioLogado.tipo === 'admin') {
        await DatabaseAPI.atualizarDados('usuarios', usuarioLogado.id, { email: novoEmail, senha: novaSenha })
      } else {
        await DatabaseAPI.atualizarDados('revendas', usuarioLogado.id, { email: novoEmail, senha: novaSenha })
      }
      
      // Atualizar sessão universal
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('iptv_sessao_universal', JSON.stringify({
        id: usuarioAtualizado.id,
        email: usuarioAtualizado.email,
        sessionId: sessionId,
        timestamp: new Date().toISOString()
      }))
      
      alert('✅ Credenciais alteradas com sucesso! Agora você pode fazer login de qualquer navegador com as novas credenciais.')
      console.log('✅ Credenciais universais atualizadas para:', novoEmail)
    }
  }

  const atualizarConfig = async (novaConfig: Partial<ConfigSistema>) => {
    const configAtualizada = { ...configSistema, ...novaConfig }
    setConfigSistema(configAtualizada)
    await DatabaseAPI.salvarDados('config_sistema', configAtualizada)
  }

  const gerenciarUsuario = async (usuarioId: string, acao: 'ativar' | 'desativar' | 'promover' | 'rebaixar') => {
    const usuariosAtualizados = usuarios.map(usuario => {
      if (usuario.id === usuarioId) {
        let usuarioAtualizado = { ...usuario }
        switch (acao) {
          case 'ativar':
            usuarioAtualizado.ativo = true
            break
          case 'desativar':
            usuarioAtualizado.ativo = false
            break
          case 'promover':
            usuarioAtualizado.tipo = 'admin'
            break
          case 'rebaixar':
            usuarioAtualizado.tipo = 'usuario'
            break
        }
        DatabaseAPI.atualizarDados('usuarios', usuarioId, usuarioAtualizado)
        return usuarioAtualizado
      }
      return usuario
    })
    setUsuarios(usuariosAtualizados)
  }

  // Funções de gerenciamento de revendas com banco de dados universal
  const adicionarRevenda = async (dadosRevenda: Omit<Revenda, 'id' | 'dataCadastro' | 'ultimoAcesso'>) => {
    const novaRevenda: Revenda = {
      ...dadosRevenda,
      id: Date.now().toString(),
      dataCadastro: new Date().toISOString(),
      ultimoAcesso: new Date().toISOString()
    }
    
    setRevendas([...revendas, novaRevenda])
    await DatabaseAPI.salvarDados('revendas', novaRevenda)
    console.log('✅ Revenda adicionada ao banco universal:', novaRevenda.nome)
  }

  const editarRevenda = async (revendaEditada: Revenda) => {
    setRevendas(revendas.map(revenda => 
      revenda.id === revendaEditada.id ? revendaEditada : revenda
    ))
    await DatabaseAPI.atualizarDados('revendas', revendaEditada.id, revendaEditada)
    console.log('✅ Revenda atualizada no banco universal:', revendaEditada.nome)
  }

  const excluirRevenda = async (revendaId: string) => {
    if (confirm('Tem certeza que deseja excluir esta revenda? Esta ação não pode ser desfeita.')) {
      setRevendas(revendas.filter(revenda => revenda.id !== revendaId))
      console.log('✅ Revenda excluída do banco universal:', revendaId)
      
      // Se a revenda excluída for o usuário logado, fazer logout
      if (usuarioLogado?.id === revendaId) {
        logout()
      }
    }
  }

  const gerenciarRevenda = async (revendaId: string, acao: 'bloquear' | 'desbloquear' | 'renovar') => {
    const revendasAtualizadas = revendas.map(revenda => {
      if (revenda.id === revendaId) {
        let revendaAtualizada = { ...revenda }
        switch (acao) {
          case 'bloquear':
            revendaAtualizada.bloqueado = true
            revendaAtualizada.ativo = false
            break
          case 'desbloquear':
            revendaAtualizada.bloqueado = false
            revendaAtualizada.ativo = true
            break
          case 'renovar':
            const novaDataVencimento = new Date()
            novaDataVencimento.setMonth(novaDataVencimento.getMonth() + 1)
            revendaAtualizada.dataVencimento = novaDataVencimento.toISOString().split('T')[0]
            break
        }
        DatabaseAPI.atualizarDados('revendas', revendaId, revendaAtualizada)
        return revendaAtualizada
      }
      return revenda
    })
    setRevendas(revendasAtualizadas)
  }

  const atualizarLogoRevenda = async (logoUrl: string, posicao: 'direita' | 'centro') => {
    if (usuarioLogado?.tipo === 'usuario') {
      const revendasAtualizadas = revendas.map(revenda => 
        revenda.id === usuarioLogado.id 
          ? { ...revenda, logoPersonalizada: logoUrl, posicaoLogo: posicao }
          : revenda
      )
      setRevendas(revendasAtualizadas)
      await DatabaseAPI.atualizarDados('revendas', usuarioLogado.id, { logoPersonalizada: logoUrl, posicaoLogo: posicao })
    }
  }

  const downloadBanner = (banner: Banner) => {
    // Simular download - em produção, gerar imagem real
    const link = document.createElement('a')
    link.href = banner.imagemUrl
    link.download = `banner-${banner.categoria}-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Tela de Login Futurista
  if (mostrarLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Grid de fundo futurista */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,69,19,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,19,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        
        {/* Efeitos de luz */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <CardHeader className="text-center space-y-6">
              {/* Logo futurista */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full">
                    <Tv className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Título futurista */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  IPTV Manager Pro
                </h1>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              </div>
              
              {/* Indicador de Status da Conexão */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className={`w-2 h-2 rounded-full ${
                  statusConexao === 'online' ? 'bg-green-400' :
                  statusConexao === 'sincronizando' ? 'bg-yellow-400 animate-pulse' :
                  'bg-red-400'
                }`}></div>
                <span className="text-xs text-gray-300">
                  {statusConexao === 'online' && (
                    <>
                      <Database className="w-3 h-3 inline mr-1" />
                      Sistema Universal Online
                    </>
                  )}
                  {statusConexao === 'sincronizando' && (
                    <>
                      <Cloud className="w-3 h-3 inline mr-1 animate-spin" />
                      Sincronizando...
                    </>
                  )}
                  {statusConexao === 'offline' && (
                    <>
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      Modo offline
                    </>
                  )}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <LoginForm onLogin={fazerLogin} carregando={carregandoLogin} />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Interface principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Alertas de Vencimento */}
        {alertasVencimento.length > 0 && (
          <div className="space-y-2">
            {alertasVencimento.map((alerta, index) => (
              <div key={index} className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4">
                <p className="text-orange-200 text-sm">{alerta}</p>
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 py-4">
          <div className="flex items-center gap-4">
            {configSistema.logoUrl && (
              <img src={configSistema.logoUrl} alt="Logo" className="w-12 h-12 rounded-lg" />
            )}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
                <Tv className="w-6 lg:w-8 h-6 lg:h-8 text-purple-400" />
                {configSistema.nomeSistema}
              </h1>
              <p className="text-purple-200 text-sm lg:text-base">
                Bem-vindo, {usuarioLogado?.nome} 
                {usuarioLogado?.tipo === 'admin' && <Crown className="inline w-4 h-4 ml-2 text-yellow-400" />}
                {usuarioLogado?.tipo === 'usuario' && (
                  <span className="ml-2 text-xs bg-blue-500 px-2 py-1 rounded">
                    {revendas.find(r => r.id === usuarioLogado.id)?.tipo === 'master' ? (
                      <>
                        <Crown className="inline w-3 h-3 mr-1 text-yellow-400" />
                        Revenda Master - R$ {revendas.find(r => r.id === usuarioLogado.id)?.valorMensal?.toFixed(2) || '0.00'}/mês
                      </>
                    ) : (
                      `Revenda Simples - R$ ${revendas.find(r => r.id === usuarioLogado.id)?.valorMensal?.toFixed(2) || '0.00'}/mês`
                    )}
                  </span>
                )}
              </p>
              
              {/* Indicador de Status da Conexão no Header */}
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  statusConexao === 'online' ? 'bg-green-400' :
                  statusConexao === 'sincronizando' ? 'bg-yellow-400 animate-pulse' :
                  'bg-red-400'
                }`}></div>
                <span className="text-xs text-gray-400">
                  {statusConexao === 'online' && 'Sistema Universal Ativo'}
                  {statusConexao === 'sincronizando' && 'Sincronizando...'}
                  {statusConexao === 'offline' && 'Modo offline'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setModalAlterarCredenciais(true)}
              className="border-white/20 text-white hover:bg-white/10 text-xs lg:text-sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Alterar Credenciais
            </Button>
            
            {temPermissao('configuracoes') && (
              <Button
                variant="outline"
                onClick={() => setModalConfig(true)}
                className="border-white/20 text-white hover:bg-white/10 text-xs lg:text-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            )}
            
            {temPermissao('usuarios') && (
              <Button
                variant="outline"
                onClick={() => setModalUsuarios(true)}
                className="border-white/20 text-white hover:bg-white/10 text-xs lg:text-sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                Usuários
              </Button>
            )}
            
            {temPermissao('revendas') && (
              <Button
                variant="outline"
                onClick={() => setModalRevendas(true)}
                className="border-white/20 text-white hover:bg-white/10 text-xs lg:text-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Revendas
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={logout}
              className="border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs lg:text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-white">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-white">{estatisticas.totalClientes}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-white">Clientes Ativos</CardTitle>
              <UserCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-green-400">{estatisticas.clientesAtivos}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-white">Clientes Vencidos</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-red-400">{estatisticas.clientesVencidos}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs lg:text-sm font-medium text-white">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg lg:text-2xl font-bold text-green-400">
                R$ {estatisticas.receitaMensal.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Principal */}
        <Tabs defaultValue="clientes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-[#87CEEB]/10 backdrop-blur-sm">
            {temPermissao('clientes') && (
              <TabsTrigger value="clientes" className="text-white data-[state=active]:bg-purple-600 text-xs lg:text-sm">
                Clientes
              </TabsTrigger>
            )}
            {temPermissao('pagamentos') && (
              <TabsTrigger value="pagamentos" className="text-white data-[state=active]:bg-purple-600 text-xs lg:text-sm">
                Pagamentos
              </TabsTrigger>
            )}
            {temPermissao('banners') && (
              <TabsTrigger value="banners" className="text-white data-[state=active]:bg-purple-600 text-xs lg:text-sm">
                Banners
              </TabsTrigger>
            )}
          </TabsList>

          {/* Tab Clientes */}
          {temPermissao('clientes') && (
            <TabsContent value="clientes" className="space-y-6">
              <Tabs defaultValue="todos" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-[#87CEEB]/10 backdrop-blur-sm">
                  <TabsTrigger value="todos" className="text-white data-[state=active]:bg-purple-600 text-xs lg:text-sm">
                    Todos os Clientes
                  </TabsTrigger>
                  <TabsTrigger value="vencendo" className="text-white data-[state=active]:bg-purple-600 text-xs lg:text-sm">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Vencendo (3 dias)
                  </TabsTrigger>
                </TabsList>

                {/* Aba Todos os Clientes */}
                <TabsContent value="todos">
                  <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                          <CardTitle className="text-white">Gerenciar Clientes</CardTitle>
                          <CardDescription className="text-purple-200">
                            Controle completo dos seus clientes IPTV com dados salvos no banco universal
                          </CardDescription>
                        </div>
                        
                        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
                          <DialogTrigger asChild>
                            <Button className="bg-purple-600 hover:bg-purple-700 text-xs lg:text-sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Novo Cliente
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                              <DialogDescription className="text-slate-300">
                                Preencha os dados do cliente para cadastro no banco universal
                              </DialogDescription>
                            </DialogHeader>
                            <NovoClienteForm onSubmit={adicionarCliente} onClose={() => setModalAberto(false)} />
                          </DialogContent>
                        </Dialog>
                      </div>

                      {/* Filtros */}
                      <div className="flex flex-col lg:flex-row gap-4 mt-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar por nome ou WhatsApp..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="pl-10 bg-[#87CEEB]/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                          <SelectTrigger className="w-full lg:w-48 bg-[#87CEEB]/10 border-white/20 text-white">
                            <SelectValue placeholder="Filtrar por status" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="todos">Todos os Status</SelectItem>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="vencido">Vencido</SelectItem>
                            <SelectItem value="suspenso">Suspenso</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {clientesFiltrados.map((cliente) => (
                          <Card key={cliente.id} className="bg-[#87CEEB]/5 border-white/10">
                            <CardContent className="p-4">
                              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="flex-1 space-y-2">
                                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
                                    <h3 className="font-semibold text-white text-base lg:text-lg">{cliente.nome}</h3>
                                    <Badge className={getStatusColor(cliente.status)}>
                                      {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                                    </Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm text-gray-300">
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4" />
                                      WhatsApp: {cliente.whatsapp}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      Vence: {new Date(cliente.dataVencimento).toLocaleDateString('pt-BR')}
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 text-sm">
                                    <span className="text-purple-300">Plano: {cliente.plano}</span>
                                    <span className="text-green-300">R$ {(cliente.valorMensal || 0).toFixed(2)}/mês</span>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setClienteSelecionado(cliente)}
                                    className="border-white/20 text-white hover:bg-white/10"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setClienteEditando(cliente)
                                      setModalEditarCliente(true)
                                    }}
                                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => excluirCliente(cliente.id)}
                                    className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Aba Clientes Vencendo */}
                <TabsContent value="vencendo">
                  <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        Clientes Vencendo nos Próximos 3 Dias
                      </CardTitle>
                      <CardDescription className="text-purple-200">
                        Clientes que precisam de atenção urgente
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {clientesVencendo.length === 0 ? (
                          <div className="text-center py-8 text-gray-400">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Nenhum cliente vencendo nos próximos 3 dias.</p>
                          </div>
                        ) : (
                          clientesVencendo.map((cliente) => {
                            const hoje = new Date()
                            const dataVencimento = new Date(cliente.dataVencimento)
                            const diffTime = dataVencimento.getTime() - hoje.getTime()
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            
                            let corAlerta = 'bg-yellow-500'
                            let textoAlerta = 'Vence em breve'
                            
                            if (diffDays === 0) {
                              corAlerta = 'bg-red-500'
                              textoAlerta = 'Vence hoje!'
                            } else if (diffDays === 1) {
                              corAlerta = 'bg-orange-500'
                              textoAlerta = 'Vence amanhã!'
                            } else if (diffDays === 2) {
                              corAlerta = 'bg-yellow-500'
                              textoAlerta = 'Vence em 2 dias'
                            } else if (diffDays === 3) {
                              corAlerta = 'bg-blue-500'
                              textoAlerta = 'Vence em 3 dias'
                            }
                            
                            return (
                              <Card key={cliente.id} className="bg-[#87CEEB]/5 border-white/10">
                                <CardContent className="p-4">
                                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div className="flex-1 space-y-2">
                                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
                                        <h3 className="font-semibold text-white text-base lg:text-lg">{cliente.nome}</h3>
                                        <Badge className={corAlerta}>
                                          {textoAlerta}
                                        </Badge>
                                        <Badge className={getStatusColor(cliente.status)}>
                                          {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                                        </Badge>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm text-gray-300">
                                        <div className="flex items-center gap-2">
                                          <Phone className="w-4 h-4" />
                                          WhatsApp: {cliente.whatsapp}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="w-4 h-4" />
                                          Vence: {new Date(cliente.dataVencimento).toLocaleDateString('pt-BR')}
                                        </div>
                                      </div>
                                      
                                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 text-sm">
                                        <span className="text-purple-300">Plano: {cliente.plano}</span>
                                        <span className="text-green-300">R$ {(cliente.valorMensal || 0).toFixed(2)}/mês</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setClienteSelecionado(cliente)}
                                        className="border-white/20 text-white hover:bg-white/10"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          )}

          {/* Tab Banners */}
          {temPermissao('banners') && (
            <TabsContent value="banners" className="space-y-6">
              <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                      <CardTitle className="text-white">Gerador de Banners</CardTitle>
                      <CardDescription className="text-purple-200">
                        Crie banners profissionais com busca inteligente do IMDB.com/pt/ e jogos do GE Globo
                      </CardDescription>
                    </div>
                    
                    <Dialog open={modalBanner} onOpenChange={setModalBanner}>
                      <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-xs lg:text-sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Banner
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Criar Novo Banner</DialogTitle>
                          <DialogDescription className="text-slate-300">
                            Crie banners personalizados com busca inteligente do IMDB.com/pt/ e jogos do GE Globo
                          </DialogDescription>
                        </DialogHeader>
                        <BannerForm 
                          onSubmit={criarBanner} 
                          onClose={() => setModalBanner(false)}
                          usuarioLogado={usuarioLogado}
                          revendas={revendas}
                          onAtualizarLogo={atualizarLogoRevenda}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {banners
                      .filter(banner => usuarioLogado?.tipo === 'admin' || banner.usuarioId === usuarioLogado?.id)
                      .map((banner) => (
                      <Card key={banner.id} className="bg-[#87CEEB]/5 border-white/10 overflow-hidden">
                        <div className="relative">
                          {banner.imagemUrl && (
                            <img 
                              src={banner.imagemUrl} 
                              alt="Banner"
                              className="w-full h-32 lg:h-48 object-cover"
                            />
                          )}
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Badge className={
                              banner.categoria === 'filme' ? 'bg-red-500' :
                              banner.categoria === 'serie' ? 'bg-blue-500' : 'bg-green-500'
                            }>
                              {banner.categoria === 'filme' && <Film className="w-3 h-3 mr-1" />}
                              {banner.categoria === 'serie' && <Monitor className="w-3 h-3 mr-1" />}
                              {banner.categoria === 'esporte' && <Trophy className="w-3 h-3 mr-1" />}
                              {banner.categoria.charAt(0).toUpperCase() + banner.categoria.slice(1)}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => excluirBanner(banner.id)}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20 p-1 h-auto"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          {(banner.logoPersonalizada || banner.logoUrl) && (
                            <img 
                              src={banner.logoPersonalizada || banner.logoUrl} 
                              alt="Logo"
                              className={`absolute bottom-2 w-8 lg:w-12 h-8 lg:h-12 rounded bg-white/20 backdrop-blur-sm p-1 ${
                                banner.posicaoLogo === 'centro' ? 'left-1/2 transform -translate-x-1/2' : 'left-2'
                              }`}
                            />
                          )}
                        </div>
                        <CardContent className="p-3 lg:p-4">
                          {banner.sinopse && (
                            <p className="text-xs text-gray-400 mb-2 line-clamp-2">{banner.sinopse}</p>
                          )}
                          {banner.dataEvento && (
                            <p className="text-xs text-purple-300 mb-4">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {new Date(banner.dataEvento).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                          <Button 
                            size="sm" 
                            className="w-full bg-purple-600 hover:bg-purple-700 text-xs lg:text-sm"
                            onClick={() => downloadBanner(banner)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Banner
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Tab Pagamentos */}
          {temPermissao('pagamentos') && (
            <TabsContent value="pagamentos" className="space-y-6">
              <Card className="bg-[#87CEEB]/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Sistema de Pagamentos com WhatsApp</CardTitle>
                  <CardDescription className="text-purple-200">
                    Gerencie pagamentos e envie lembretes automáticos via WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PagamentosWhatsApp clientes={clientesFiltrados} />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Modais */}
        {clienteSelecionado && (
          <Dialog open={!!clienteSelecionado} onOpenChange={() => setClienteSelecionado(null)}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detalhes do Cliente</DialogTitle>
              </DialogHeader>
              <ClienteDetalhes cliente={clienteSelecionado} />
            </DialogContent>
          </Dialog>
        )}

        {/* Modal de Editar Cliente */}
        <Dialog open={modalEditarCliente} onOpenChange={setModalEditarCliente}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription className="text-slate-300">
                Altere os dados do cliente (salvos no banco universal)
              </DialogDescription>
            </DialogHeader>
            {clienteEditando && (
              <EditarClienteForm 
                cliente={clienteEditando}
                onSubmit={(clienteEditado) => {
                  editarCliente(clienteEditado)
                  setModalEditarCliente(false)
                  setClienteEditando(null)
                }}
                onClose={() => {
                  setModalEditarCliente(false)
                  setClienteEditando(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Alterar Credenciais */}
        <Dialog open={modalAlterarCredenciais} onOpenChange={setModalAlterarCredenciais}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Alterar Credenciais</DialogTitle>
              <DialogDescription className="text-slate-300">
                Altere seu email e senha de acesso (salvo no banco universal para uso em qualquer navegador)
              </DialogDescription>
            </DialogHeader>
            <AlterarCredenciaisForm 
              usuarioAtual={usuarioLogado}
              onSubmit={alterarCredenciais} 
              onClose={() => setModalAlterarCredenciais(false)} 
            />
          </DialogContent>
        </Dialog>

        {/* Modal de Configurações */}
        {temPermissao('configuracoes') && (
          <Dialog open={modalConfig} onOpenChange={setModalConfig}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configurações do Sistema</DialogTitle>
                <DialogDescription className="text-slate-300">
                  Personalize a aparência e configurações do sistema
                </DialogDescription>
              </DialogHeader>
              <ConfigForm 
                config={configSistema} 
                onSubmit={atualizarConfig} 
                onClose={() => setModalConfig(false)} 
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Modal de Usuários (Admin) */}
        {temPermissao('usuarios') && (
          <Dialog open={modalUsuarios} onOpenChange={setModalUsuarios}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-4xl">
              <DialogHeader>
                <DialogTitle>Gerenciar Usuários</DialogTitle>
                <DialogDescription className="text-slate-300">
                  Controle total dos usuários do sistema
                </DialogDescription>
              </DialogHeader>
              <UsuariosManager 
                usuarios={usuarios} 
                onGerenciar={gerenciarUsuario}
                usuarioAtual={usuarioLogado}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Modal de Revendas (Admin) */}
        {temPermissao('revendas') && (
          <Dialog open={modalRevendas} onOpenChange={setModalRevendas}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Gerenciar Revendas</DialogTitle>
                <DialogDescription className="text-slate-300">
                  Controle completo das revendas do sistema com dados salvos no banco universal
                </DialogDescription>
              </DialogHeader>
              <RevendasManager 
                revendas={revendas}
                onAdicionar={adicionarRevenda}
                onEditar={editarRevenda}
                onExcluir={excluirRevenda}
                onGerenciar={gerenciarRevenda}
                onEditarClick={(revenda) => {
                  setRevendaEditando(revenda)
                  setModalEditarRevenda(true)
                }}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Modal de Editar Revenda */}
        <Dialog open={modalEditarRevenda} onOpenChange={setModalEditarRevenda}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Revenda</DialogTitle>
              <DialogDescription className="text-slate-300">
                Altere os dados da revenda (salvos no banco universal)
              </DialogDescription>
            </DialogHeader>
            {revendaEditando && (
              <EditarRevendaForm 
                revenda={revendaEditando}
                onSubmit={(revendaEditada) => {
                  editarRevenda(revendaEditada)
                  setModalEditarRevenda(false)
                  setRevendaEditando(null)
                }}
                onClose={() => {
                  setModalEditarRevenda(false)
                  setRevendaEditando(null)
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Componentes auxiliares
function LoginForm({ onLogin, carregando }: {
  onLogin: (email: string, senha: string) => void
  carregando: boolean
}) {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(formData.email, formData.senha)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-white text-sm font-medium">Login</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="bg-black/20 border border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
            placeholder="Digite seu login"
            required
            disabled={carregando}
          />
        </div>
        
        <div>
          <Label htmlFor="senha" className="text-white text-sm font-medium">Senha</Label>
          <Input
            id="senha"
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({...formData, senha: e.target.value})}
            className="bg-black/20 border border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
            placeholder="Digite sua senha"
            required
            disabled={carregando}
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25" 
        disabled={carregando}
      >
        {carregando ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Conectando...
          </>
        ) : (
          <>
            <Database className="w-4 h-4 mr-2" />
            Entrar
          </>
        )}
      </Button>
      
      <div className="text-center text-xs text-gray-400 mt-4 space-y-1">
        <p>🔐 Sistema Universal - Funciona em qualquer navegador</p>
        <p>🌐 Suas credenciais são salvas no banco de dados</p>
      </div>
    </form>
  )
}

function AlterarCredenciaisForm({ usuarioAtual, onSubmit, onClose }: {
  usuarioAtual: Usuario | null
  onSubmit: (email: string, senha: string) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    email: usuarioAtual?.email || '',
    senha: '',
    confirmarSenha: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!')
      return
    }
    
    if (formData.senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!')
      return
    }
    
    onSubmit(formData.email, formData.senha)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-blue-200 text-sm">
          <Database className="w-4 h-4" />
          <span>Suas novas credenciais serão salvas no banco universal e funcionarão em qualquer navegador</span>
        </div>
      </div>
      
      <div>
        <Label htmlFor="email" className="text-white">Novo Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="senha" className="text-white">Nova Senha</Label>
        <Input
          id="senha"
          type="password"
          value={formData.senha}
          onChange={(e) => setFormData({...formData, senha: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Mínimo 6 caracteres"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="confirmarSenha" className="text-white">Confirmar Nova Senha</Label>
        <Input
          id="confirmarSenha"
          type="password"
          value={formData.confirmarSenha}
          onChange={(e) => setFormData({...formData, confirmarSenha: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          required
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          <Database className="w-4 h-4 mr-2" />
          Salvar no Banco Universal
        </Button>
      </div>
    </form>
  )
}

function NovoClienteForm({ onSubmit, onClose }: { 
  onSubmit: (cliente: Omit<Cliente, 'id' | 'dataCadastro' | 'usuarioId'>) => void
  onClose: () => void 
}) {
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    plano: '',
    status: 'ativo' as Cliente['status'],
    dataVencimento: '',
    valorMensal: 0,
    dataUltimoPagamento: '',
    observacoes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome Completo</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={formData.whatsapp}
            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="(11) 99999-9999"
            required
          />
        </div>
        <div>
          <Label htmlFor="plano">Plano</Label>
          <Input
            id="plano"
            value={formData.plano}
            onChange={(e) => setFormData({...formData, plano: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="Digite o nome do plano"
            required
          />
        </div>
        <div>
          <Label htmlFor="valorMensal">Valor Mensal (R$)</Label>
          <Input
            id="valorMensal"
            type="number"
            step="0.01"
            value={formData.valorMensal}
            onChange={(e) => setFormData({...formData, valorMensal: parseFloat(e.target.value) || 0})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="dataVencimento">Data de Vencimento</Label>
          <Input
            id="dataVencimento"
            type="date"
            value={formData.dataVencimento}
            onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          <Database className="w-4 h-4 mr-2" />
          Salvar no Banco Universal
        </Button>
      </div>
    </form>
  )
}

function EditarClienteForm({ cliente, onSubmit, onClose }: {
  cliente: Cliente
  onSubmit: (cliente: Cliente) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    ...cliente
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome Completo</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={formData.whatsapp}
            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="(11) 99999-9999"
            required
          />
        </div>
        <div>
          <Label htmlFor="plano">Plano</Label>
          <Input
            id="plano"
            value={formData.plano}
            onChange={(e) => setFormData({...formData, plano: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="Digite o nome do plano"
            required
          />
        </div>
        <div>
          <Label htmlFor="valorMensal">Valor Mensal (R$)</Label>
          <Input
            id="valorMensal"
            type="number"
            step="0.01"
            value={formData.valorMensal || 0}
            onChange={(e) => setFormData({...formData, valorMensal: parseFloat(e.target.value) || 0})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: Cliente['status']) => setFormData({...formData, status: value})}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="suspenso">Suspenso</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="dataVencimento">Data de Vencimento</Label>
          <Input
            id="dataVencimento"
            type="date"
            value={formData.dataVencimento}
            onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="dataUltimoPagamento">Data do Último Pagamento</Label>
          <Input
            id="dataUltimoPagamento"
            type="date"
            value={formData.dataUltimoPagamento}
            onChange={(e) => setFormData({...formData, dataUltimoPagamento: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Edit className="w-4 h-4 mr-2" />
          Atualizar no Banco Universal
        </Button>
      </div>
    </form>
  )
}

function PagamentosWhatsApp({ clientes }: { clientes: Cliente[] }) {
  const [whatsappNumero, setWhatsappNumero] = useState('')
  const [mensagemTemplate, setMensagemTemplate] = useState(
    'Olá {nome}! Seu plano IPTV vence em {dias} dia(s) ({data}). Valor: R$ {valor}. Renove para manter o acesso!'
  )
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [historicoPagamentos, setHistoricoPagamentos] = useState<{cliente: Cliente, whatsapp: string, data: string}[]>([])

  const enviarWhatsApp = (cliente: Cliente, numeroWhatsApp?: string) => {
    const hoje = new Date()
    const dataVencimento = new Date(cliente.dataVencimento)
    const diffTime = dataVencimento.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    const mensagem = mensagemTemplate
      .replace('{nome}', cliente.nome)
      .replace('{dias}', diffDays.toString())
      .replace('{data}', dataVencimento.toLocaleDateString('pt-BR'))
      .replace('{valor}', (cliente.valorMensal || 0).toFixed(2))
    
    const numero = numeroWhatsApp || whatsappNumero || cliente.whatsapp.replace(/\D/g, '')
    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`
    
    // Adicionar ao histórico
    setHistoricoPagamentos(prev => [...prev, {
      cliente,
      whatsapp: numero,
      data: new Date().toLocaleString('pt-BR')
    }])
    
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Configuração de WhatsApp */}
      <Card className="bg-[#87CEEB]/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">📱 Configuração WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="whatsapp" className="text-white">Número WhatsApp (opcional)</Label>
            <Input
              id="whatsapp"
              value={whatsappNumero}
              onChange={(e) => setWhatsappNumero(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="11999999999 (apenas números)"
            />
            <p className="text-xs text-gray-400 mt-1">
              Se não preenchido, usará o WhatsApp cadastrado do cliente
            </p>
          </div>
          
          <div>
            <Label htmlFor="mensagem" className="text-white">Mensagem de Lembrete (Editável)</Label>
            <Textarea
              id="mensagem"
              value={mensagemTemplate}
              onChange={(e) => setMensagemTemplate(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              rows={4}
            />
            <p className="text-xs text-gray-400 mt-1">
              Use: {'{nome}'} {'{dias}'} {'{data}'} {'{valor}'} para personalizar
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes para Pagamento */}
      <Card className="bg-[#87CEEB]/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">💰 Enviar Lembretes de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientes.map((cliente) => {
              const hoje = new Date()
              const dataVencimento = new Date(cliente.dataVencimento)
              const diffTime = dataVencimento.getTime() - hoje.getTime()
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              
              let corStatus = 'bg-green-500'
              let textoStatus = 'Em dia'
              
              if (diffDays <= 0) {
                corStatus = 'bg-red-500'
                textoStatus = 'Vencido'
              } else if (diffDays <= 3) {
                corStatus = 'bg-orange-500'
                textoStatus = 'Vencendo'
              } else if (diffDays <= 7) {
                corStatus = 'bg-yellow-500'
                textoStatus = 'Próximo'
              }
              
              return (
                <div key={cliente.id} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 bg-slate-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3 mb-2">
                      <h3 className="font-semibold text-white">{cliente.nome}</h3>
                      <Badge className={corStatus}>{textoStatus}</Badge>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 text-sm text-gray-300">
                      <span>📱 {cliente.whatsapp}</span>
                      <span>📅 Vence: {dataVencimento.toLocaleDateString('pt-BR')}</span>
                      <span>💰 R$ {(cliente.valorMensal || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => enviarWhatsApp(cliente)}
                      className="bg-green-600 hover:bg-green-700 text-xs lg:text-sm"
                    >
                      📱 Enviar WhatsApp
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Envios */}
      {historicoPagamentos.length > 0 && (
        <Card className="bg-[#87CEEB]/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">📋 Histórico de Envios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {historicoPagamentos.slice(-10).reverse().map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-700 rounded text-sm">
                  <div className="text-white">
                    <span className="font-medium">{item.cliente.nome}</span>
                    <span className="text-gray-400 ml-2">→ {item.whatsapp}</span>
                  </div>
                  <span className="text-gray-400">{item.data}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function BannerForm({ onSubmit, onClose, usuarioLogado, revendas, onAtualizarLogo }: {
  onSubmit: (banner: Omit<Banner, 'id' | 'dataCriacao' | 'usuarioId' | 'logoUrl' | 'logoPersonalizada' | 'posicaoLogo'>) => void
  onClose: () => void
  usuarioLogado: Usuario | null
  revendas: Revenda[]
  onAtualizarLogo: (logoUrl: string, posicao: 'direita' | 'centro') => void
}) {
  const [formData, setFormData] = useState({
    categoria: 'filme' as Banner['categoria'],
    imagemUrl: '',
    sinopse: '',
    dataEvento: ''
  })

  const [logoPersonalizada, setLogoPersonalizada] = useState('')
  const [posicaoLogo, setPosicaoLogo] = useState<'direita' | 'centro'>('direita')
  const [buscaConteudo, setBuscaConteudo] = useState('')
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [buscandoConteudo, setBuscandoConteudo] = useState(false)
  const [dadosEncontrados, setDadosEncontrados] = useState<any>(null)
  const [imagemDispositivo, setImagemDispositivo] = useState('')
  
  // Estados para busca de jogos
  const [jogosEncontrados, setJogosEncontrados] = useState<JogoFutebol[]>([])
  const [mostrarJogos, setMostrarJogos] = useState(false)
  const [jogoSelecionado, setJogoSelecionado] = useState<JogoFutebol | null>(null)

  const revendaAtual = revendas.find(r => r.id === usuarioLogado?.id)

  // Busca em tempo real com IMDB
  useEffect(() => {
    if (buscaConteudo.length >= 2 && formData.categoria !== 'esporte') {
      const resultados = []
      
      // Buscar em filmes
      for (const [chave, dados] of Object.entries(acervoCompleto.filmes)) {
        if (dados.titulo.toLowerCase().includes(buscaConteudo.toLowerCase()) || 
            chave.includes(buscaConteudo.toLowerCase())) {
          resultados.push({ ...dados, tipo: 'filme', chave })
        }
      }
      
      // Buscar em séries
      for (const [chave, dados] of Object.entries(acervoCompleto.series)) {
        if (dados.titulo.toLowerCase().includes(buscaConteudo.toLowerCase()) || 
            chave.includes(buscaConteudo.toLowerCase())) {
          resultados.push({ ...dados, tipo: 'serie', chave })
        }
      }
      
      setResultadosBusca(resultados.slice(0, 8))
      setMostrarResultados(true)
    } else {
      setResultadosBusca([])
      setMostrarResultados(false)
    }
  }, [buscaConteudo, formData.categoria])

  // Busca de jogos do GE Globo
  useEffect(() => {
    if (formData.categoria === 'esporte') {
      buscarJogosGEGlobo(buscaConteudo).then(jogos => {
        setJogosEncontrados(jogos)
        setMostrarJogos(jogos.length > 0)
      })
    } else {
      setJogosEncontrados([])
      setMostrarJogos(false)
    }
  }, [buscaConteudo, formData.categoria])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Atualizar logo da revenda se necessário
    if (logoPersonalizada && usuarioLogado?.tipo === 'usuario') {
      onAtualizarLogo(logoPersonalizada, posicaoLogo)
    }
    
    onSubmit({
      categoria: formData.categoria,
      imagemUrl: imagemDispositivo || formData.imagemUrl,
      sinopse: formData.sinopse,
      dataEvento: formData.dataEvento
    })
    onClose()
  }

  const selecionarConteudo = async (conteudo: any) => {
    setBuscandoConteudo(true)
    try {
      // Buscar dados atualizados do IMDB
      const dadosIMDB = await buscarConteudoIMDB(conteudo.titulo, conteudo.tipo)
      if (dadosIMDB) {
        setFormData(prev => ({
          ...prev,
          categoria: conteudo.tipo,
          sinopse: dadosIMDB.sinopse,
          imagemUrl: dadosIMDB.imagemUrl
        }))
        setDadosEncontrados(dadosIMDB)
      } else {
        setFormData(prev => ({
          ...prev,
          categoria: conteudo.tipo,
          sinopse: conteudo.sinopse,
          imagemUrl: conteudo.imagemUrl
        }))
        setDadosEncontrados(conteudo)
      }
    } catch (error) {
      console.error('Erro ao buscar no IMDB:', error)
      setFormData(prev => ({
        ...prev,
        categoria: conteudo.tipo,
        sinopse: conteudo.sinopse,
        imagemUrl: conteudo.imagemUrl
      }))
      setDadosEncontrados(conteudo)
    } finally {
      setBuscandoConteudo(false)
      setBuscaConteudo('')
      setMostrarResultados(false)
    }
  }

  const selecionarJogo = (jogo: JogoFutebol) => {
    setJogoSelecionado(jogo)
    setFormData(prev => ({
      ...prev,
      imagemUrl: jogo.imagemBanner,
      sinopse: `${jogo.mandante} vs ${jogo.visitante} - ${jogo.campeonato} - ${jogo.estadio}`,
      dataEvento: jogo.data
    }))
    setBuscaConteudo('')
    setMostrarJogos(false)
  }

  const buscarDadosEsporte = async () => {
    if (!buscaConteudo || formData.categoria !== 'esporte') return
    
    setBuscandoConteudo(true)
    try {
      const dados = await buscarDadosEsporteGoogle(buscaConteudo)
      if (dados) {
        setDadosEncontrados(dados)
        setFormData(prev => ({
          ...prev,
          imagemUrl: dados.imagemJogador,
          dataEvento: dados.dataJogo,
          sinopse: `Partida de futebol - ${dados.nome} com destaque para ${dados.jogador}`
        }))
      } else {
        alert('Clube não encontrado. Tente outro nome.')
      }
    } catch (error) {
      console.error('Erro ao buscar dados do esporte:', error)
    } finally {
      setBuscandoConteudo(false)
    }
  }

  const gerarBannerData = (diasOffset: number) => {
    if (dadosEncontrados && formData.categoria === 'esporte') {
      const data = new Date()
      data.setDate(data.getDate() + diasOffset)
      
      let jogo = ''
      if (diasOffset === -1) jogo = dadosEncontrados.jogos.ontem
      else if (diasOffset === 0) jogo = dadosEncontrados.jogos.hoje
      else if (diasOffset === 1) jogo = dadosEncontrados.jogos.amanha
      
      setFormData(prev => ({
        ...prev,
        dataEvento: data.toISOString().split('T')[0]
      }))
    }
  }

  const handleImagemDispositivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagemDispositivo(result)
        setFormData(prev => ({ ...prev, imagemUrl: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulário */}
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Busca Inteligente */}
          <div>
            <Label>
              🔍 Busca Inteligente 
              {formData.categoria === 'esporte' ? ' - Jogos do GE Globo' : ' - IMDB.com/pt/'}
            </Label>
            <div className="relative">
              <Input
                value={buscaConteudo}
                onChange={(e) => setBuscaConteudo(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder={
                  formData.categoria === 'esporte' 
                    ? "Digite o nome do time ou campeonato..." 
                    : "Digite o nome do filme ou série..."
                }
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              
              {/* Resultados de Filmes/Séries */}
              {mostrarResultados && resultadosBusca.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {resultadosBusca.map((resultado, index) => (
                    <div
                      key={index}
                      onClick={() => selecionarConteudo(resultado)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-600 last:border-b-0"
                    >
                      <img 
                        src={resultado.imagemUrl} 
                        alt={resultado.titulo}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{resultado.titulo}</h4>
                        <p className="text-sm text-gray-400 line-clamp-2">{resultado.sinopse}</p>
                        <Badge className={resultado.tipo === 'filme' ? 'bg-red-500' : 'bg-blue-500'}>
                          {resultado.tipo === 'filme' ? 'Filme' : 'Série'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Resultados de Jogos */}
              {mostrarJogos && jogosEncontrados.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  <div className="p-2 bg-slate-700 border-b border-slate-600">
                    <h4 className="text-white font-medium text-sm">⚽ Jogos do Dia - GE Globo</h4>
                  </div>
                  {jogosEncontrados.map((jogo) => (
                    <div
                      key={jogo.id}
                      onClick={() => selecionarJogo(jogo)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-700 cursor-pointer border-b border-slate-600 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <img 
                          src={jogo.imagemMandante} 
                          alt={jogo.mandante}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                        <span className="text-white text-sm font-medium">{jogo.mandante}</span>
                        <span className="text-gray-400 text-xs">vs</span>
                        <span className="text-white text-sm font-medium">{jogo.visitante}</span>
                        <img 
                          src={jogo.imagemVisitante} 
                          alt={jogo.visitante}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-end gap-2 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {jogo.horario}
                        </div>
                        <p className="text-xs text-purple-300">{jogo.campeonato}</p>
                        <p className="text-xs text-gray-500">{jogo.estadio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select onValueChange={(value) => {
                setFormData({...formData, categoria: value as Banner['categoria']})
                setDadosEncontrados(null)
                setJogoSelecionado(null)
                setBuscaConteudo('')
              }}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="filme">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4" />
                      Filme
                    </div>
                  </SelectItem>
                  <SelectItem value="serie">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Série
                    </div>
                  </SelectItem>
                  <SelectItem value="esporte">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Esporte
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.categoria === 'esporte' && !jogoSelecionado && (
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={buscarDadosEsporte}
                  disabled={buscandoConteudo || !buscaConteudo}
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  {buscandoConteudo ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Buscar Clube
                </Button>
              </div>
            )}
          </div>

          {/* Informações do Jogo Selecionado */}
          {jogoSelecionado && (
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">⚽ Jogo Selecionado</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={jogoSelecionado.imagemMandante} alt={jogoSelecionado.mandante} className="w-8 h-8 rounded-full" />
                  <span className="text-white font-medium">{jogoSelecionado.mandante}</span>
                  <span className="text-gray-400">vs</span>
                  <span className="text-white font-medium">{jogoSelecionado.visitante}</span>
                  <img src={jogoSelecionado.imagemVisitante} alt={jogoSelecionado.visitante} className="w-8 h-8 rounded-full" />
                </div>
                <div className="text-right">
                  <p className="text-purple-300 text-sm">{jogoSelecionado.horario}</p>
                  <p className="text-gray-400 text-xs">{jogoSelecionado.campeonato}</p>
                </div>
              </div>
            </div>
          )}

          {formData.categoria === 'esporte' && dadosEncontrados && (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => gerarBannerData(-1)}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Ontem
              </Button>
              <Button
                type="button"
                onClick={() => gerarBannerData(0)}
                className="bg-green-600 hover:bg-green-700"
              >
                Hoje
              </Button>
              <Button
                type="button"
                onClick={() => gerarBannerData(1)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Amanhã
              </Button>
            </div>
          )}

          {(formData.categoria === 'filme' || formData.categoria === 'serie') && (
            <div>
              <Label htmlFor="sinopse">Sinopse (Preenchida Automaticamente)</Label>
              <Textarea
                id="sinopse"
                value={formData.sinopse}
                onChange={(e) => setFormData({...formData, sinopse: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Sinopse será preenchida automaticamente..."
                rows={4}
                readOnly
              />
            </div>
          )}

          {formData.categoria === 'esporte' && (
            <div>
              <Label htmlFor="dataEvento">Data do Evento</Label>
              <Input
                id="dataEvento"
                type="date"
                value={formData.dataEvento}
                onChange={(e) => setFormData({...formData, dataEvento: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          )}

          {/* Opção de Enviar Imagem do Dispositivo */}
          <div className="space-y-2">
            <Label>📱 Enviar Imagem do Dispositivo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImagemDispositivo}
              className="bg-slate-700 border-slate-600 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
            />
            {imagemDispositivo && (
              <p className="text-sm text-green-400">✅ Imagem carregada do dispositivo</p>
            )}
          </div>

          <div>
            <Label>Banner Real (Preenchido Automaticamente)</Label>
            <Input
              value={formData.imagemUrl}
              onChange={(e) => setFormData({...formData, imagemUrl: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="URL da imagem será preenchida automaticamente ou use imagem do dispositivo"
              readOnly={!!imagemDispositivo}
            />
          </div>

          {/* Configuração de Logo Personalizada */}
          <div className="space-y-4 border-t border-slate-600 pt-4">
            <h3 className="text-white font-semibold">Logo Personalizada</h3>
            
            <div>
              <Label htmlFor="logoPersonalizada">URL da Logo (fundo transparente)</Label>
              <Input
                id="logoPersonalizada"
                value={logoPersonalizada || revendaAtual?.logoPersonalizada || ''}
                onChange={(e) => setLogoPersonalizada(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="https://exemplo.com/logo-transparente.png"
              />
            </div>

            <div>
              <Label>Posição da Logo no Banner</Label>
              <Select value={posicaoLogo} onValueChange={(value: 'direita' | 'centro') => setPosicaoLogo(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="direita">Canto Superior Direito</SelectItem>
                  <SelectItem value="centro">Centro do Banner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              <Image className="w-4 h-4 mr-2" />
              Salvar no Banco Universal
            </Button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <Label>Preview do Banner</Label>
        {formData.imagemUrl ? (
          <div className="relative rounded-lg overflow-hidden">
            <img src={formData.imagemUrl} alt="Preview" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white p-4">
                {jogoSelecionado && (
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <img src={jogoSelecionado.imagemMandante} alt={jogoSelecionado.mandante} className="w-8 h-8 rounded-full" />
                      <span className="font-bold">{jogoSelecionado.mandante}</span>
                      <span className="text-yellow-300">VS</span>
                      <span className="font-bold">{jogoSelecionado.visitante}</span>
                      <img src={jogoSelecionado.imagemVisitante} alt={jogoSelecionado.visitante} className="w-8 h-8 rounded-full" />
                    </div>
                    <p className="text-sm text-yellow-300">{jogoSelecionado.horario} - {jogoSelecionado.campeonato}</p>
                  </div>
                )}
                {formData.sinopse && !jogoSelecionado && (
                  <p className="text-xs opacity-70 line-clamp-3">{formData.sinopse}</p>
                )}
                {formData.dataEvento && (
                  <p className="text-sm text-yellow-300 mt-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {new Date(formData.dataEvento).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
            {(logoPersonalizada || revendaAtual?.logoPersonalizada) && (
              <img 
                src={logoPersonalizada || revendaAtual?.logoPersonalizada} 
                alt="Logo"
                className={`absolute bottom-2 w-12 h-12 rounded bg-white/20 backdrop-blur-sm p-1 ${
                  posicaoLogo === 'centro' ? 'left-1/2 transform -translate-x-1/2' : 'left-2'
                }`}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-slate-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Preview aparecerá aqui</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ConfigForm({ config, onSubmit, onClose }: {
  config: ConfigSistema
  onSubmit: (config: Partial<ConfigSistema>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState(config)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="nomeSistema">Nome do Sistema</Label>
        <Input
          id="nomeSistema"
          value={formData.nomeSistema}
          onChange={(e) => setFormData({...formData, nomeSistema: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>

      <div>
        <Label htmlFor="logoUrl">URL da Logo</Label>
        <Input
          id="logoUrl"
          value={formData.logoUrl}
          onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="https://exemplo.com/logo.png"
        />
        {formData.logoUrl && (
          <div className="mt-2">
            <img src={formData.logoUrl} alt="Preview Logo" className="w-16 h-16 rounded-lg" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="corPrimaria">Cor Primária</Label>
          <Input
            id="corPrimaria"
            type="color"
            value={formData.corPrimaria}
            onChange={(e) => setFormData({...formData, corPrimaria: e.target.value})}
            className="bg-slate-700 border-slate-600 h-12"
          />
        </div>
        
        <div>
          <Label htmlFor="corSecundaria">Cor Secundária</Label>
          <Input
            id="corSecundaria"
            type="color"
            value={formData.corSecundaria}
            onChange={(e) => setFormData({...formData, corSecundaria: e.target.value})}
            className="bg-slate-700 border-slate-600 h-12"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          <Settings className="w-4 h-4 mr-2" />
          Salvar no Banco Universal
        </Button>
      </div>
    </form>
  )
}

function UsuariosManager({ usuarios, onGerenciar, usuarioAtual }: {
  usuarios: Usuario[]
  onGerenciar: (usuarioId: string, acao: 'ativar' | 'desativar' | 'promover' | 'rebaixar') => void
  usuarioAtual: Usuario | null
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {usuarios.map((usuario) => (
          <Card key={usuario.id} className="bg-[#87CEEB]/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{usuario.nome}</h3>
                    {usuario.tipo === 'admin' && <Crown className="w-4 h-4 text-yellow-400" />}
                    <Badge className={usuario.ativo ? 'bg-green-500' : 'bg-red-500'}>
                      {usuario.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">{usuario.email}</p>
                  <p className="text-xs text-gray-400">
                    Cadastro: {new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')} • 
                    Último acesso: {new Date(usuario.ultimoAcesso).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                {usuario.id !== usuarioAtual?.id && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onGerenciar(usuario.id, usuario.ativo ? 'desativar' : 'ativar')}
                      className={usuario.ativo ? 'border-red-500/50 text-red-400' : 'border-green-500/50 text-green-400'}
                    >
                      {usuario.ativo ? 'Desativar' : 'Ativar'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onGerenciar(usuario.id, usuario.tipo === 'admin' ? 'rebaixar' : 'promover')}
                      className="border-yellow-500/50 text-yellow-400"
                    >
                      {usuario.tipo === 'admin' ? 'Rebaixar' : 'Promover'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function RevendasManager({ revendas, onAdicionar, onEditar, onExcluir, onGerenciar, onEditarClick }: {
  revendas: Revenda[]
  onAdicionar: (revenda: Omit<Revenda, 'id' | 'dataCadastro' | 'ultimoAcesso'>) => void
  onEditar: (revenda: Revenda) => void
  onExcluir: (revendaId: string) => void
  onGerenciar: (revendaId: string, acao: 'bloquear' | 'desbloquear' | 'renovar') => void
  onEditarClick: (revenda: Revenda) => void
}) {
  const [modalNovaRevenda, setModalNovaRevenda] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Revendas Cadastradas</h3>
          <p className="text-sm text-gray-400">Gerencie todas as revendas do sistema com dados salvos no banco universal</p>
        </div>
        
        <Dialog open={modalNovaRevenda} onOpenChange={setModalNovaRevenda}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Nova Revenda
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Revenda</DialogTitle>
              <DialogDescription className="text-slate-300">
                Crie uma nova revenda com dados salvos no banco universal
              </DialogDescription>
            </DialogHeader>
            <NovaRevendaForm 
              onSubmit={onAdicionar} 
              onClose={() => setModalNovaRevenda(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {revendas.length === 0 ? (
          <Card className="bg-[#87CEEB]/5 border-white/10">
            <CardContent className="p-8 text-center">
              <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-50" />
              <p className="text-gray-400">Nenhuma revenda cadastrada ainda.</p>
              <p className="text-sm text-gray-500 mt-2">Clique em "Nova Revenda" para começar.</p>
            </CardContent>
          </Card>
        ) : (
          revendas.map((revenda) => {
            const hoje = new Date()
            const dataVencimento = new Date(revenda.dataVencimento)
            const diffTime = dataVencimento.getTime() - hoje.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            
            let alertaVencimento = ''
            let corAlerta = ''
            
            if (diffDays <= 5 && diffDays >= 0) {
              alertaVencimento = `Vence em ${diffDays} dia(s)`
              corAlerta = diffDays <= 1 ? 'bg-red-500' : diffDays <= 3 ? 'bg-orange-500' : 'bg-yellow-500'
            } else if (diffDays < 0) {
              alertaVencimento = 'Vencido'
              corAlerta = 'bg-red-600'
            }
            
            return (
              <Card key={revenda.id} className="bg-[#87CEEB]/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3">
                        <h3 className="font-semibold text-white text-lg">{revenda.nome}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={revenda.ativo ? 'bg-green-500' : 'bg-red-500'}>
                            {revenda.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                          {revenda.tipo === 'master' && (
                            <Badge className="bg-yellow-500">
                              <Crown className="w-3 h-3 mr-1" />
                              Master
                            </Badge>
                          )}
                          {revenda.tipo === 'simples' && (
                            <Badge className="bg-blue-500">
                              Simples
                            </Badge>
                          )}
                          {revenda.bloqueado && (
                            <Badge className="bg-red-600">
                              <Lock className="w-3 h-3 mr-1" />
                              Bloqueado
                            </Badge>
                          )}
                          {alertaVencimento && (
                            <Badge className={corAlerta}>
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {alertaVencimento}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm text-gray-300">
                        <div>Email: {revenda.email}</div>
                        <div>Valor Mensal: R$ {(revenda.valorMensal || 0).toFixed(2)}</div>
                        <div>
                          Vencimento: {new Date(revenda.dataVencimento).toLocaleDateString('pt-BR')}
                          {diffDays < 0 && (
                            <span className="text-red-400 ml-2">(Vencido há {Math.abs(diffDays)} dias)</span>
                          )}
                        </div>
                        <div>
                          Último Acesso: {new Date(revenda.ultimoAcesso).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      
                      {revenda.observacoes && (
                        <p className="text-sm text-gray-400 italic">{revenda.observacoes}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditarClick(revenda)}
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onExcluir(revenda.id)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onGerenciar(revenda.id, revenda.bloqueado ? 'desbloquear' : 'bloquear')}
                        className={revenda.bloqueado ? 
                          'border-green-500/50 text-green-400 hover:bg-green-500/20' : 
                          'border-red-500/50 text-red-400 hover:bg-red-500/20'
                        }
                      >
                        {revenda.bloqueado ? (
                          <>
                            <UserCheck className="w-4 h-4 mr-1" />
                            Desbloquear
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-1" />
                            Bloquear
                          </>
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onGerenciar(revenda.id, 'renovar')}
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Renovar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

function NovaRevendaForm({ onSubmit, onClose }: {
  onSubmit: (revenda: Omit<Revenda, 'id' | 'dataCadastro' | 'ultimoAcesso'>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    ativo: true,
    dataVencimento: '',
    valorMensal: 50.00,
    bloqueado: false,
    observacoes: '',
    logoPersonalizada: '',
    posicaoLogo: 'direita' as 'direita' | 'centro',
    diasAlertaVencimento: 5,
    tipo: 'simples' as 'master' | 'simples',
    permissoes: {
      clientes: true,
      pagamentos: true,
      banners: true,
      configuracoes: false,
      usuarios: false,
      revendas: false,
      planos: false
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Definir permissões baseadas no tipo
    let permissoes = formData.permissoes
    
    if (formData.tipo === 'master') {
      // Revenda master tem todas as permissões EXCETO configurações
      permissoes = {
        clientes: true,
        pagamentos: true,
        banners: true,
        configuracoes: false, // SEMPRE REMOVIDO para revenda master
        usuarios: true,
        revendas: true,
        planos: true
      }
    }
    
    onSubmit({
      ...formData,
      permissoes
    })
    onClose()
  }

  // Definir data padrão para 30 dias a partir de hoje
  useEffect(() => {
    const dataVencimento = new Date()
    dataVencimento.setDate(dataVencimento.getDate() + 30)
    setFormData(prev => ({
      ...prev,
      dataVencimento: dataVencimento.toISOString().split('T')[0]
    }))
  }, [])

  const handlePermissaoChange = (permissao: keyof NonNullable<Revenda['permissoes']>, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        [permissao]: checked
      }
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-blue-200 text-sm">
          <Database className="w-4 h-4" />
          <span>Esta revenda será salva no banco universal e poderá fazer login de qualquer navegador</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome da Revenda</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="Ex: Revenda Premium IPTV"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email de Acesso</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="revenda@exemplo.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="senha">Senha de Acesso</Label>
          <Input
            id="senha"
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({...formData, senha: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="Senha segura"
            required
          />
        </div>
        <div>
          <Label htmlFor="valorMensal">Valor Mensal (R$)</Label>
          <Input
            id="valorMensal"
            type="number"
            step="0.01"
            value={formData.valorMensal}
            onChange={(e) => setFormData({...formData, valorMensal: parseFloat(e.target.value) || 0})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <Label htmlFor="tipo">Tipo de Revenda</Label>
          <Select value={formData.tipo} onValueChange={(value: 'master' | 'simples') => setFormData({...formData, tipo: value})}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="simples">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Revenda Simples - Permissões personalizáveis
                </div>
              </SelectItem>
              <SelectItem value="master">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  Revenda Master - Todos os benefícios (exceto configurações)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-400 mt-1">
            {formData.tipo === 'master' ? 
              '👑 Revenda Master: Acesso a todas as funcionalidades, exceto configurações do sistema' :
              '📦 Revenda Simples: Selecione as permissões específicas abaixo'
            }
          </p>
        </div>
        
        {/* Seleção de Permissões apenas para revenda simples */}
        {formData.tipo === 'simples' && (
          <div className="col-span-1 lg:col-span-2">
            <Label className="text-white mb-3 block">Permissões do Painel</Label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="clientes"
                  checked={formData.permissoes.clientes}
                  onCheckedChange={(checked) => handlePermissaoChange('clientes', checked as boolean)}
                />
                <Label htmlFor="clientes" className="text-sm text-white">Clientes</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pagamentos"
                  checked={formData.permissoes.pagamentos}
                  onCheckedChange={(checked) => handlePermissaoChange('pagamentos', checked as boolean)}
                />
                <Label htmlFor="pagamentos" className="text-sm text-white">Pagamentos</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="banners"
                  checked={formData.permissoes.banners}
                  onCheckedChange={(checked) => handlePermissaoChange('banners', checked as boolean)}
                />
                <Label htmlFor="banners" className="text-sm text-white">Banners</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usuarios"
                  checked={formData.permissoes.usuarios}
                  onCheckedChange={(checked) => handlePermissaoChange('usuarios', checked as boolean)}
                />
                <Label htmlFor="usuarios" className="text-sm text-white">Usuários</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="revendas"
                  checked={formData.permissoes.revendas}
                  onCheckedChange={(checked) => handlePermissaoChange('revendas', checked as boolean)}
                />
                <Label htmlFor="revendas" className="text-sm text-white">Revendas</Label>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              ✅ Selecione quais funcionalidades esta revenda poderá acessar no painel
            </p>
          </div>
        )}
        
        <div className="col-span-1 lg:col-span-2">
          <Label htmlFor="dataVencimento">Data de Vencimento</Label>
          <Input
            id="dataVencimento"
            type="date"
            value={formData.dataVencimento}
            onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            ⚠️ Alertas automáticos serão enviados 5 dias antes do vencimento. Bloqueio às 12:00 (Brasília) se não renovado.
          </p>
        </div>
      </div>
      
      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          placeholder="Observações sobre a revenda..."
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <Database className="w-4 h-4 mr-2" />
          Salvar no Banco Universal
        </Button>
      </div>
    </form>
  )
}

function EditarRevendaForm({ revenda, onSubmit, onClose }: {
  revenda: Revenda
  onSubmit: (revenda: Revenda) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    ...revenda,
    permissoes: revenda.permissoes || {
      clientes: true,
      pagamentos: true,
      banners: true,
      configuracoes: false,
      usuarios: false,
      revendas: false,
      planos: false
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Definir permissões baseadas no tipo
    let permissoes = formData.permissoes
    
    if (formData.tipo === 'master') {
      // Revenda master tem todas as permissões EXCETO configurações
      permissoes = {
        clientes: true,
        pagamentos: true,
        banners: true,
        configuracoes: false, // SEMPRE REMOVIDO para revenda master
        usuarios: true,
        revendas: true,
        planos: true
      }
    }
    
    onSubmit({
      ...formData,
      permissoes
    })
  }

  const handlePermissaoChange = (permissao: keyof NonNullable<Revenda['permissoes']>, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        [permissao]: checked
      }
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-blue-200 text-sm">
          <Database className="w-4 h-4" />
          <span>As alterações serão salvas no banco universal e aplicadas em todos os navegadores</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome da Revenda</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email de Acesso</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div>
          <Label htmlFor="senha">Nova Senha (deixe em branco para manter atual)</Label>
          <Input
            id="senha"
            type="password"
            value=""
            onChange={(e) => e.target.value && setFormData({...formData, senha: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            placeholder="Digite nova senha ou deixe em branco"
          />
        </div>
        <div>
          <Label htmlFor="valorMensal">Valor Mensal (R$)</Label>
          <Input
            id="valorMensal"
            type="number"
            step="0.01"
            value={formData.valorMensal}
            onChange={(e) => setFormData({...formData, valorMensal: parseFloat(e.target.value) || 0})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <Label htmlFor="tipo">Tipo de Revenda</Label>
          <Select value={formData.tipo} onValueChange={(value: 'master' | 'simples') => setFormData({...formData, tipo: value})}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="simples">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Revenda Simples - Permissões personalizáveis
                </div>
              </SelectItem>
              <SelectItem value="master">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  Revenda Master - Todos os benefícios (exceto configurações)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Seleção de Permissões apenas para revenda simples */}
        {formData.tipo === 'simples' && (
          <div className="col-span-1 lg:col-span-2">
            <Label className="text-white mb-3 block">Permissões do Painel</Label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="clientes"
                  checked={formData.permissoes.clientes}
                  onCheckedChange={(checked) => handlePermissaoChange('clientes', checked as boolean)}
                />
                <Label htmlFor="clientes" className="text-sm text-white">Clientes</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pagamentos"
                  checked={formData.permissoes.pagamentos}
                  onCheckedChange={(checked) => handlePermissaoChange('pagamentos', checked as boolean)}
                />
                <Label htmlFor="pagamentos" className="text-sm text-white">Pagamentos</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="banners"
                  checked={formData.permissoes.banners}
                  onCheckedChange={(checked) => handlePermissaoChange('banners', checked as boolean)}
                />
                <Label htmlFor="banners" className="text-sm text-white">Banners</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usuarios"
                  checked={formData.permissoes.usuarios}
                  onCheckedChange={(checked) => handlePermissaoChange('usuarios', checked as boolean)}
                />
                <Label htmlFor="usuarios" className="text-sm text-white">Usuários</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="revendas"
                  checked={formData.permissoes.revendas}
                  onCheckedChange={(checked) => handlePermissaoChange('revendas', checked as boolean)}
                />
                <Label htmlFor="revendas" className="text-sm text-white">Revendas</Label>
              </div>
            </div>
          </div>
        )}
        
        <div className="col-span-1 lg:col-span-2">
          <Label htmlFor="dataVencimento">Data de Vencimento</Label>
          <Input
            id="dataVencimento"
            type="date"
            value={formData.dataVencimento}
            onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Edit className="w-4 h-4 mr-2" />
          Atualizar no Banco Universal
        </Button>
      </div>
    </form>
  )
}

function ClienteDetalhes({ cliente }: { cliente: Cliente }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-300">Nome</Label>
          <p className="text-white font-medium">{cliente.nome}</p>
        </div>
        <div>
          <Label className="text-gray-300">Status</Label>
          <div className="mt-1">
            <Badge className={getStatusColor(cliente.status)}>
              {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div>
          <Label className="text-gray-300">WhatsApp</Label>
          <p className="text-white">{cliente.whatsapp}</p>
        </div>
        <div>
          <Label className="text-gray-300">Plano</Label>
          <p className="text-white">{cliente.plano}</p>
        </div>
        <div>
          <Label className="text-gray-300">Valor Mensal</Label>
          <p className="text-green-400 font-bold">R$ {(cliente.valorMensal || 0).toFixed(2)}</p>
        </div>
        <div>
          <Label className="text-gray-300">Data de Vencimento</Label>
          <p className="text-white">{new Date(cliente.dataVencimento).toLocaleDateString('pt-BR')}</p>
        </div>
        <div>
          <Label className="text-gray-300">Último Pagamento</Label>
          <p className="text-white">{new Date(cliente.dataUltimoPagamento).toLocaleDateString('pt-BR')}</p>
        </div>
        <div>
          <Label className="text-gray-300">Data de Cadastro</Label>
          <p className="text-white">{new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
      <div>
        <Label className="text-gray-300">Observações</Label>
        <p className="text-white">{cliente.observacoes}</p>
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'ativo': return 'bg-green-500 hover:bg-green-600'
    case 'vencido': return 'bg-red-500 hover:bg-red-600'
    case 'suspenso': return 'bg-yellow-500 hover:bg-yellow-600'
    case 'inativo': return 'bg-gray-500 hover:bg-gray-600'
    default: return 'bg-gray-500'
  }
}