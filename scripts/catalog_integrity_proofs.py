"""Strict, source-bound exceptions for errors in an immutable source archive."""
def documented_archive_correction(component, original, corrections, field, archive_field):
    proof=component.get('primaryCorrectionProof') or {}
    for correction in corrections:
        if correction.get('id')!=component['id'] or correction.get('field')!=field:continue
        if correction.get('oldValue')!=original.get(archive_field) or correction.get('newValue')!=component.get(field):continue
        if proof.get(field)!=component.get(field) or not proof.get('identityMatches'):continue
        if correction.get('sourceURL') not in proof.get('manufacturerSources',[]):continue
        if not correction.get('reason','').strip():continue
        return correction
    return None

def documented_capacity_correction(component, original, corrections):
    return documented_archive_correction(component, original, corrections, 'capacityGB', 'capacity')

def documented_wattage_correction(component, original, corrections):
    return documented_archive_correction(component, original, corrections, 'wattage', 'wattage')
