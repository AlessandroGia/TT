package it.unimol.tt.oggetti.entita;

import jakarta.persistence.*;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "correlatore_tesi")
public class CorrelatoreTesi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tesi_id", nullable = false)
    private Tesi tesi;

    @ManyToOne
    @JoinColumn(name = "correlatore_id", nullable = false)
    private Utente correlatore;
}
