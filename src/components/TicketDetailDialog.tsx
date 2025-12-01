import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { useTickets } from '@/contexts/TicketContext';
import { Ticket } from '@/types/ticket';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Save, MessageSquarePlus, Play, Pause, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface TicketDetailDialogProps {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TicketDetailDialog = ({
  ticket,
  open,
  onOpenChange,
}: TicketDetailDialogProps) => {
  const { updateDescription, addNote, updateTicketStatus } = useTickets();
  const [description, setDescription] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  if (!ticket) return null;

  const handleSaveDescription = () => {
    updateDescription(ticket.id, description);
    setIsEditingDescription(false);
    toast.success('Descrição atualizada!');
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote(ticket.id, newNote);
    setNewNote('');
    toast.success('Nota adicionada!');
  };

  const startEditingDescription = () => {
    setDescription(ticket.description);
    setIsEditingDescription(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl">{ticket.title}</DialogTitle>
            <div className="flex items-center gap-2">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {ticket.status === 'open' && (
              <>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => {
                    updateTicketStatus(ticket.id, 'paused');
                    toast.success('Chamado pausado!');
                  }}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pausar
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    updateTicketStatus(ticket.id, 'closed');
                    toast.success('Chamado finalizado!');
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Finalizar
                </Button>
              </>
            )}
            {ticket.status === 'paused' && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    updateTicketStatus(ticket.id, 'open');
                    toast.success('Chamado retomado!');
                  }}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Retomar
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    updateTicketStatus(ticket.id, 'closed');
                    toast.success('Chamado finalizado!');
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Finalizar
                </Button>
              </>
            )}
            {ticket.status === 'closed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  updateTicketStatus(ticket.id, 'open');
                  toast.success('Chamado reaberto!');
                }}
              >
                <Play className="h-4 w-4 mr-1" />
                Reabrir
              </Button>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Descrição</Label>
              {!isEditingDescription && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startEditingDescription}
                >
                  Editar
                </Button>
              )}
            </div>
            {isEditingDescription ? (
              <div className="space-y-2">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Adicione uma descrição..."
                  maxLength={1000}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingDescription(false)}
                  >
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSaveDescription}>
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm bg-muted/50 rounded-lg p-3">
                {ticket.description || 'Nenhuma descrição adicionada.'}
              </p>
            )}
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Notas ({ticket.notes.length})</Label>
            
            {/* Add Note */}
            <div className="flex gap-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Adicionar uma nota..."
                rows={2}
                className="flex-1"
                maxLength={500}
              />
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="self-end"
              >
                <MessageSquarePlus className="h-4 w-4" />
              </Button>
            </div>

            {/* Notes List */}
            {ticket.notes.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {ticket.notes.map((note, index) => (
                  <div
                    key={index}
                    className="bg-accent/50 rounded-lg p-3 text-sm animate-fade-in"
                  >
                    {note}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Criado em:</span>
              <p className="font-medium">
                {format(ticket.createdAt, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Atualizado em:</span>
              <p className="font-medium">
                {format(ticket.updatedAt, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
