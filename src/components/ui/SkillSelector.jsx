import React, { useState, useRef, useEffect } from "react";
import styles from "./SkillSelector.module.css";

export const SkillSelector = ({
  skills,
  selectedSkills = [],
  onSelect,
  onRemove,
  placeholder = "Buscar skills...",
  label = "Skills",
  required = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Agrupar skills por categoria
  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.categoria?.nome || "Sem categoria";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categories = ["all", ...Object.keys(skillsByCategory).sort()];

  // Filtrar skills baseado na busca e categoria
  const filteredSkills = Object.entries(skillsByCategory).reduce(
    (acc, [category, skillsList]) => {
      if (selectedCategory !== "all" && category !== selectedCategory) {
        return acc;
      }

      const filtered = skillsList.filter((skill) => {
        const searchLower = searchTerm.toLowerCase().trim();
        if (!searchLower) return true;
        return skill.nome.toLowerCase().includes(searchLower);
      });

      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {},
  );

  // Verificar se uma skill está selecionada
  const isSelected = (skillId) => {
    return selectedSkills.some((s) => s.id === skillId);
  };

  // Toggle skill selection
  const toggleSkill = (skill) => {
    if (isSelected(skill.id)) {
      onRemove(skill.id);
    } else {
      onSelect(skill);
    }
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fechar dropdown ao pressionar ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Contagem de skills selecionadas
  const selectedCount = selectedSkills.length;

  return (
    <div className={styles.container} ref={containerRef}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>

      {/* Input com skills selecionadas */}
      <div
        className={`${styles.inputWrapper} ${isOpen ? styles.focused : ""}`}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <div className={styles.selectedSkills}>
          {selectedSkills.map((skill) => (
            <span key={skill.id} className={styles.selectedSkill}>
              {skill.nome}
              <button
                type="button"
                className={styles.removeSkill}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(skill.id);
                }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder={selectedCount === 0 ? placeholder : ""}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchTerm.trim()) {
                // Tentar encontrar e selecionar a primeira skill que corresponde
                const firstMatch = Object.values(filteredSkills)
                  .flat()
                  .find((s) => !isSelected(s.id));
                if (firstMatch) {
                  toggleSkill(firstMatch);
                  setSearchTerm("");
                }
              }
            }}
          />
          <span className={styles.skillCount}>
            {selectedCount} skill{selectedCount !== 1 ? "s" : ""}
          </span>
          <button
            type="button"
            className={styles.toggleButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className={styles.dropdown}>
          {/* Barra de filtros */}
          <div className={styles.filterBar}>
            <div className={styles.categoryFilter}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.categoryButton} ${selectedCategory === cat ? styles.active : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "all" ? "Todas" : cat}
                </button>
              ))}
            </div>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                className={styles.filterSearch}
                placeholder="Filtrar skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  type="button"
                  className={styles.clearSearch}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm("");
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Lista de skills */}
          <div className={styles.skillsList}>
            {Object.keys(filteredSkills).length === 0 ? (
              <div className={styles.noResults}>
                {searchTerm ? (
                  <p>Nenhuma skill encontrada para "{searchTerm}"</p>
                ) : (
                  <p>Nenhuma skill disponível nesta categoria</p>
                )}
              </div>
            ) : (
              Object.entries(filteredSkills).map(([category, skillsList]) => (
                <div key={category} className={styles.categoryGroup}>
                  <div className={styles.categoryHeader}>
                    <span className={styles.categoryName}>{category}</span>
                    <span className={styles.categoryCount}>
                      {skillsList.length} skill
                      {skillsList.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className={styles.skillsGrid}>
                    {skillsList.map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        className={`${styles.skillOption} ${isSelected(skill.id) ? styles.selected : ""}`}
                        onClick={() => toggleSkill(skill)}
                      >
                        <span className={styles.skillName}>{skill.nome}</span>
                        {isSelected(skill.id) && (
                          <span className={styles.checkmark}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer com ações rápidas */}
          <div className={styles.dropdownFooter}>
            <span className={styles.footerInfo}>
              {selectedCount} skill{selectedCount !== 1 ? "s" : ""} selecionada
              {selectedCount !== 1 ? "s" : ""}
            </span>
            <div className={styles.footerActions}>
              {selectedCount > 0 && (
                <button
                  type="button"
                  className={styles.clearAllButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectedSkills.forEach((s) => onRemove(s.id));
                  }}
                >
                  Limpar todas
                </button>
              )}
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
