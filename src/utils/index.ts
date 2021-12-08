import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function formatDate(strDate: string): string {
  let dateFormated = format(parseISO(strDate), 'dd-MMMM-yyyy', {
    locale: ptBR,
  });

  const dateStringSplited = dateFormated.split('-');
  dateStringSplited[1] = dateStringSplited[1].substr(0, 3);

  dateFormated = dateStringSplited.join(' ');

  return dateFormated;
}
